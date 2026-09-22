function randomNumber() {
    return Math.floor(Math.random() * 10);
}

function wait2Seconds() {
    return new Promise(resolve => {
        setTimeout(resolve, 2000);
    });
}

async function playGame() {

    for (let i = 1; i <= 3; i++) {

        console.log("Wait 2 second ...");

        await wait2Seconds();

        let num = randomNumber();

        console.log("Num " + i + " : " + num);

        if (num % 2 !== 0) {
            console.log("You lost");
            return;
        }
    }

    console.log("You win");
}

playGame();