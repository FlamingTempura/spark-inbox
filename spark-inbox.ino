#include "SparkButton/SparkButton.h"

SparkButton b = SparkButton();

int brightness = 60; // up to 255

void setup() {
    b.begin();
    Spark.function("setLEDs", setLEDs);
}

void loop() {}

int setLEDs(String command) {
    int val = atoi(command.c_str());
    for (int i = 0; i <= 11; i++) {
        if (i > val) {
            b.ledOff(i);
        } else if (i > 8) {
            b.ledOn(i, brightness, 0, 0);
        } else if (i > 4) {
            b.ledOn(i, brightness, brightness, 0);
        } else {
            b.ledOn(i, 0, brightness, 0);
        }
    }
    return 1;
}
