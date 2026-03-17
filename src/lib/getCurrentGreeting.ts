function getCurrentGreeting() {
    const currentHour = new Date().getHours();
    let greetingMessage;

    if (currentHour < 12) {
        greetingMessage = "Good Morning";
    } else if (currentHour < 18) {
        greetingMessage = "Good Afternoon";
    } else {
        greetingMessage = "Good Evening";
    }

    return greetingMessage;
}

export default getCurrentGreeting;