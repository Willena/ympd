#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include "plugin.h"
#include "mpd_client.h"


void load_plugins(struct threads_status *status) {


    free(status->registered_plugins);
    status->plugin_number = 1;
    status->registered_plugins = calloc(status->plugin_number, sizeof(struct plugin));


    FILE *config_file = NULL;

    config_file = fopen("plugins_config.cfg", "r");
    if (config_file == NULL) {
        initialize_config_file();
    }
    else {
        fclose(config_file);
    }

    config_file = fopen("plugins_config.cfg", "r");
    char *line = NULL;
    size_t len;
    ssize_t read;

    if (config_file != NULL) {
        printf("(Main) -> Loading config file ...\n");
        while ((read = getline(&line, &len, config_file)) != -1) {
            //printf("(Main) -> line  size : %zu \n", read);
            if (line[0] != '#') {

                if ((strlen(line) > 0) && (line[strlen(line) - 1] == '\n'))
                    line[strlen(line) - 1] = '\0';

                printf("(Main) -> line : '%s' \n", line);

                char name[50], path[400];
                char callback_char[3];
                sscanf(line, "%s : %s : %s", name, path, callback_char);

                int pos = status->plugin_number - 1;

                strcpy(status->registered_plugins[pos].name, name);
                strcpy(status->registered_plugins[pos].path, path);
                status->registered_plugins[pos].send_callback = atoi(callback_char);

                status->plugin_number++;
                status->registered_plugins = realloc(status->registered_plugins,
                                                     status->plugin_number * sizeof(struct plugin));
            }
        }
        fclose(config_file);
        int i;
        for (i = 0; i < status->plugin_number - 1; i++) {

            printf("\t(Plugin) -> name : '%s'\n\t         -> path : '%s' \n\t         -> callback : '%d'\n",
                   status->registered_plugins[i].name, status->registered_plugins[i].path,
                   status->registered_plugins[i].send_callback);
        }
        printf("(Main) -> Plugins loaded, found %d \n", status->plugin_number - 1);


    }
    else {
        printf("(Main) -> Config file cannot be opened, will be skiped, no plugin will work !\n");
    }
}

void query_plugin(char *cmd, struct threads_status *status, struct mg_connection *c ) {

    printf("(Query) -> ok\n");
    int cmd_size = strlen(cmd);
    char *delim = strchr(cmd, ',');
    if (delim == NULL) {
        printf("(Query) -> Invalid cmd !\n");
        return;
    }
    size_t n = 0;

    int pos = delim - cmd + 1;
    char *plugin_name = calloc(pos, sizeof(char));
    char *plugin_args = calloc(cmd_size - pos+1, sizeof(char));

    strncpy(plugin_name, cmd, (pos - 1) * sizeof(char));
    strncpy(plugin_args, cmd + pos, (cmd_size - pos) * sizeof(char));

    //plugin_args[(cmd_size - pos)] = '\0';
    free(cmd);

    printf("(Main) -> name : '%s' arg : '%s' \n", plugin_name, plugin_args);

    int plugin_row = get_plugin_info(status, plugin_name);
    if (plugin_row != 0) {
        printf("(Main) -> Plugin %s is not registered ! Did you reload ympd after editing config file ?\n",
               plugin_name);
    }
    else {
        n = snprintf(mpd.buf, MAX_SIZE, "{\"type\":\"plugin\", \"data\": { \"name\" : \"%s\", \"message\" : \"\", \"state\":\"start\"}}", plugin_name);
        mg_websocket_write(c, 1, mpd.buf, n);
        addThread(status, c ,plugin_args, plugin_row);
    }

    free(plugin_name);

}

int get_plugin_info(struct threads_status *status, char *name) {
    int i;
    for (i = 0; i < status->plugin_number - 1; i++) {
        printf("(Main) -> comparaison : %d \n", strcmp(status->registered_plugins[i].name, name));
        if (strcmp(status->registered_plugins[i].name, name) == 0)
            return i;
    }
    return -1;
}

void initialize_config_file() {

    printf("(Main) -> Config file does not exit ! Creating one .... \n");

    FILE *blank_config_file = NULL;
    blank_config_file = fopen("plugins_config.cfg", "w+");

    if (blank_config_file != NULL) {
        fputs("# Lines with # will be ignored\n", blank_config_file);
        fputs("# The config file is parsed with scanf and has to be writen this way :\n", blank_config_file);
        fputs("# plugin-name : pathToScript : send-callback\n", blank_config_file);
        fputs("#                  ^                    ^\n", blank_config_file);
        fputs("# from root dir    |                    |\n", blank_config_file);
        fputs("# -----------------                     |\n", blank_config_file);
        fputs("#                                       |\n", blank_config_file);
        fputs("#  need to be 0 or 1 send last message  |\n", blank_config_file);
        fputs("#  from std throught ws to the client   |\n", blank_config_file);
        fputs("# --------------------------------------\n", blank_config_file);
        fputs("# example:\n", blank_config_file);
        fputs("#ytdl : /home/truc/scripts/youtube-dl.sh : 1\n", blank_config_file);
    }

    fclose(blank_config_file);
}

char *appendc(char *source, char add) {
    char *newString = (char *) malloc(strlen(source) * sizeof(char) + 2);
    strcpy(newString, source);
    newString[strlen(source)] = add;
    newString[strlen(source) + 1] = '\0';
    free(source);
    return newString;
}

char *clearStr(char *str) {
    free(str);
    char *str1 = (char *) malloc(sizeof(char));
    strcpy(str1, "");
    return str1;
}

void addThread(struct threads_status *pThreadStatus, struct mg_connection *c, char *argv, int plg) {


    int pos = pThreadStatus->array_size - 1;
    struct single_thread *current_thread = malloc(sizeof(struct single_thread));
    current_thread->index = pos;
    current_thread->status = pThreadStatus;
    current_thread->plugin_id = plg;
    current_thread->c = c;

    printf("\t(Add thread) -> Index value %d \n", current_thread->index);


    pThreadStatus->array_thread[pos].argv_string = strdup(argv);

    if (pthread_create(&pThreadStatus->array_thread[pos].thread_id, NULL, plugin_thread, current_thread)) {
        perror("pthread_create");
        exit(2 + pThreadStatus->array_size);
    }

    pThreadStatus->array_size++;
    pThreadStatus->array_thread = realloc(pThreadStatus->array_thread,
                                          pThreadStatus->array_size * sizeof(struct thread_info));


}

void *plugin_thread(void *arguments) {
    struct single_thread *info = arguments;
    int index = info->index;
    int plugin_id = info->plugin_id;
    size_t n =0;

    printf("\t\t(thread-%s) ->Index value %d \n", info->status->array_thread[index].argv_string, index);

    int size = strlen(info->status->array_thread[index].argv_string) +
               strlen(info->status->registered_plugins[plugin_id].path) + 5;

    char *cmd_line = calloc(size, sizeof(char));
    strcpy(cmd_line, info->status->registered_plugins[plugin_id].path);
    strcat(cmd_line, " \"");
    strcat(cmd_line, info->status->array_thread[index].argv_string);
    strcat(cmd_line, "\" 2>&1");

    printf("\t\t(thread-%s) -> cmd : %s \n", info->status->array_thread[index].argv_string, cmd_line);

    FILE *file = popen(cmd_line, "r");

    char *str = (char *) malloc(sizeof(char));
    char c;
    while ((c = getc(file)) != EOF) {
        if (c == '\n') {
            printf("\t\t\t(thread-%s)App : %s\n", info->status->array_thread[index].argv_string, str);

            if (info->status->registered_plugins[plugin_id].send_callback == 1)
            {
                n = snprintf(mpd.buf, MAX_SIZE, "{\"type\":\"plugin\", \"data\": { \"name\" : \"%s\", \"message\" : \"%s\", \"state\":\"running\"}}",  info->status->registered_plugins[plugin_id].name,str);
                mg_websocket_write(info->c, 1, mpd.buf, n);
            }


            str = clearStr(str);
        }
        else {
            str = appendc(str, c);
        }
    }

    int ret = pclose(file);

    printf("\t\t(thread-%s) ->return code : %d \n", info->status->array_thread[index].argv_string, ret);

    n = snprintf(mpd.buf, MAX_SIZE, "{\"type\":\"plugin\", \"data\": { \"name\" : \"%s\", \"message\" : \"%d\", \"state\":\"end\"}}",  info->status->registered_plugins[plugin_id].name,ret);
    mg_websocket_write(info->c, 1, mpd.buf, n);

    free(str);

    free(info->status->array_thread[index].argv_string);
    free(cmd_line);
    free(arguments);
    return NULL;
}

void *main_thread(void *args) {
    struct mixed_main_status *mixed = args;
    struct threads_status *status = mixed->status;


    printf("(Main_thread) -> array size %d\n", status->array_size);
    printf("(Main_thread) -> mexied num size %d\n", mixed->main_th->thread_num);
    while (1) {


        if (status->array_size > 1) {
            int i;
            for (i = 0; i < status->array_size - 1; i++) {
                if (pthread_join(status->array_thread[i].thread_id, NULL) != 0) {
                    printf("(Main) -> pthread_joinerr %d \n", i);
                    perror("pthread_join");
                }
            }


            free(status->array_thread);
            status->array_size = 1;
            status->array_thread = calloc(status->array_size, sizeof(struct thread_info));

            printf("(Main_thread) -> clearing : Done  ! \n");
        }

        if (mixed->main_th->thread_num != 0)
            return NULL;

        sleep(10);
    }

    return NULL;
}
