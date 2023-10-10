//Practica 2A Quesitos everywhere
type Question = {
    category: string,
    type: string,
    difficulty: string,
    question: string,
    correct_answer: string,
    incorrect_answers: string[]
}

type Player = {
    name: string;
    difficulty: string;
    rounds: number;
    questions: Question[];
    score: number
}

const players: Player[] = []

//Preguntamos el numero de jugadores
const numPlayers = parseInt(String(prompt("¿Cuantos jugadores hay?")))

//Preguntamos el nombre, dificultad y rondas de cada jugador
for(let i = 0; i < numPlayers; i++){
    console.log(`\nJugador ${i+1}`)
    const name = prompt("¿Cual es tu nombre?", "Jugador " + (i+1))

    let difficulty = ""
    while (difficulty != "easy" && difficulty != "medium" && difficulty != "hard"){
          difficulty =prompt("¿Que dificultad quieres? (easy, medium, hard)", "easy")
    }
    let rounds = 0
    while (isNaN(rounds) || rounds < 1){
        rounds = parseInt(prompt("¿Cuantas rondas quieres jugar?", "1"))
    }

    players.push({name, difficulty, rounds, questions:[], score: 0})
}

//buscamos las preguntas de cada jugador
const apiBase= "https://opentdb.com/api.php?amount="
for (let player of players){
    const response = await fetch(apiBase + player.rounds + "&difficulty=" + player.difficulty).then(res => res.json()).then((res) => {
        res.results.forEach((element: any) => {
            player.questions.push(element)
        })
    })
}

//calculamos el numero maximo de rondas
const maxRounds= players.reduce((cont:number,elem:Player)=> elem.rounds>cont?cont=elem.rounds: cont=cont,0)
console.log("Numero total de rondas: " + maxRounds)

//hacemos las rondas de preguntas
for (let i=0; i<maxRounds; i++){
    for(let player of players){
        if(i<player.rounds){
            console.log("-- Pregunta " + (i+1) + " " + player.name)
            //imprimimos la pregunta
            console.log(player.questions[i].question)
            if (player.questions[i].type=="boolean"){ //si es de tipo boolean
                //mostramos las opciones
                const answer = parseInt(prompt("1- Verdadero\n2- Falso\n¿Cual es la respuesta correcta?", "1"))
                //comprobamos el resultado
                if(player.questions[i].correct_answer=="True" && answer==1 ||
                    player.questions[i].correct_answer=="False" && answer==2){
                    console.log("Correcto")
                    player.score+=1
                }else{
                    console.log("Incorrecto")
                }
            }else{ //si es de tipo multiple
                const answers:string[] = player.questions[i].incorrect_answers
                answers.push(player.questions[i].correct_answer)
                //mezcla de respuestas con un sort aleatorio
                answers.sort(() => Math.random() - 0.5)
                //mostramos las opciones
                for(let index=1; index<=answers.length; index++){
                    console.log(index + "- " + answers[index-1])
                }
                const answer = parseInt(prompt("¿Cual es la respuesta correcta?", "1"))
                //comprobamos el resultado
                if(answers[answer-1]==player.questions[i].correct_answer){
                    console.log("Correcto")
                    player.score+=1
                }else
                    console.log("Incorrecto")
            }
        }
    }
}

//imprimimos los resultados
console.log("\nResultados:")
const maxScore= players.reduce((cont:number,elem:Player)=> elem.score>cont?cont=elem.score: cont=cont,0)
console.log("Maxima puntuacion: "+ maxScore)

const maxScorePlayer:Player[]= players.filter((elem:Player)=> elem.score==maxScore)
console.log("Jugadores con maxima puntuacion: ")
for(let player of maxScorePlayer){
    console.log(player.name)
}

