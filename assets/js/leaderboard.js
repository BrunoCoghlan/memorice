const pb = new PocketBase('https://memorice.eajou.cl');

const LeaderBoard = {
    async getLeaderBoard() {
        const scores = await pb.collection('scores').getFullList({
            sort: '-score, -created',
        });
        return {
            normal: scores.filter(score => score.gameMode === "normal").slice(0, 5),
            survival: scores.filter(score => score.gameMode === "survival").slice(0, 5),
            timeAttack: scores.filter(score => score.gameMode === "timeAttack").slice(0, 5),
        }
    },
    async saveScore(gameMode, score) {
        let userName = prompt("Ingresa tu nombre para guardar tu puntaje", "");
        if (!userName) return;
        return await pb.collection('scores').create({gameMode, name: userName, score});
    }
}