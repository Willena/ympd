//
// Created by Willena on 12/03/2016.
//

#ifndef THREADTESTING_PLUGIN_H_H
#define THREADTESTING_PLUGIN_H_H

struct thread_info {
    pthread_t thread_id;
    int thread_num;
    char *argv_string;
};

struct threads_status {
    struct thread_info *array_thread;
    int array_size;
    struct plugin *registered_plugins;
    int plugin_number;
};

struct single_thread {
    struct threads_status *status;
    int index;
    int plugin_id;
};

struct mixed_main_status {
    struct threads_status *status;
    struct thread_info *main_th;
};

struct plugin{
    char name[50];
    char path[400];
    int send_callback;
};

void addThread(struct threads_status *pThreadStatus, char *argv, int plg_number);
void *plugin_thread(void *arguments);
void *main_thread(void *arguments);
char *clearStr(char *str);
char *appendc(char *source, char add);

void initialize_config_file();
int get_plugin_info(struct threads_status* status, char* name);
void query_plugin(char* cmd, struct threads_status *status);
void load_plugins(struct threads_status *status);

#endif //THREADTESTING_PLUGIN_H_H
