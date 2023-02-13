    #include <iostream>
#include <fstream>
#include <string>
#include <unistd.h>
#include <signal.h>
#include <csignal>


using namespace std;


/**
 * Used to create a new text file for each child and continously save the user message in it
 * @param [String] userData: The user inputted message
 * @param [pid_t] parent: The process id of the parent
 * @param [pid_t] location: The process id of the child
*/
void newProcess(string userData, pid_t parent, pid_t location){
    
    // creates the new text file using the process id of the child as the unique identifier
    // also opens the file for writting
    ofstream fw("process/id_" + to_string(location) + ".txt", ofstream::out);

    // checks if the file is opened
    if (fw.is_open()){

        // continously writes the user message into the text file
        while (true){

            if (getppid() != parent){
                break;
            }

            fw << userData << " ";
            fw.flush();
            // waits for 1 second before starting again
            sleep(1);
        }

        // closes the file
        fw.close();
    }
    
}

int main() {

    // gets the current process id and sets it as the parent since its the first process id
    pid_t parent = getpid(); 
    
    // used to control when to stop the process
    bool cont = true;
    
    // allows for the process to continously run
    while (cont){

        // checks to see if the process running this code is the parent (first) process
        if (getpid() != parent){
            break;
        }

        // used to store the user message
        string userData;

        // asks the user to input some text
        cout << "Please Enter Some Text (If you want to exit, type Done): ";
            
        // gets the user input as a whole line
        getline(cin, userData);

        // checks if the user entered Done
        if (userData == "Done"){

            // if true, then it will set cont to false to end the loop
            cont = false;

            // then kill all the processes from the parent
            kill(0, SIGQUIT);

            // breaks the loop
            break;
        }
        
        // creates a child process
        pid_t child = fork();

        // checks if the new process is created and is indeed the child
        if (child == 0){

            // calls the newProcess function
            newProcess(userData, parent, getpid());
        }
        
    }

    // ends the main function
    return 0;
}
