const app = Vue.createApp({

    data(){
        return {
            gameConf: {
                attackCount: 0,
                yourTurn: true,
                winner: '',
                user:{
                    simpleAttackMin: 5,
                    simpleAttackMax: 10,
                    specialAttackMin: 15,
                    specialAttackMax: 20,
                    healMin: 5,
                    healMax: 10
                },
                monster:{
                    simpleAttackMin: 8,
                    simpleAttackMax: 13,
                }
            },
            userHelath: 100,
            monsterHealth: 100,
            gameLog: []
        };
    },

    computed: {

        isSpecialAttackEnable(){
            return this.gameConf.attackCount !== 0 
            && this.gameConf.attackCount % 3 === 0  
        },
        isYourTurn(){
            return this.gameConf.yourTurn
        },
        getUserHealth(){
            if (this.userHelath <= 0) {
                return `0%`
            }
            return `${this.userHelath}%`
        },
        getMonsterHealth(){
            if (this.monsterHealth <= 0) {
                return `0%`
            }
            return `${this.monsterHealth}%`
        }

    },
    watch: {
        userHelath(newVal){
            if (newVal <= 0) {
                this.gameConf.winner = 'Monster'
            }
        },
        monsterHealth(newVal){
            if (newVal <= 0) {
                this.gameConf.winner = 'User'
            }
        }
    },

    methods: {
        getRamdome(min, max){
            return Math.floor(Math.random() * (max - min) + min);
        },

        userAttack(min, max){
            this.gameConf.attackCount += 1
            const attack = this.getRamdome(min, max)
            this.monsterHealth -= attack
            this.addGameLog('You', 'Attack', 'Monster', attack)
        },


        monsterAttack(
            min = this.gameConf.monster.simpleAttackMin,
            max = this.gameConf.monster.simpleAttackMax
        ){
            this.gameConf.yourTurn = false
            setTimeout(()=>{
                const attack = this.getRamdome(
                    min,
                    max
                )
                this.userHelath -= attack
                this.addGameLog('Monster', 'Attack', 'You', attack)
                this.gameConf.yourTurn = true
            },1000)
        },

        onAttack(){
            this.userAttack(
                this.gameConf.user.simpleAttackMin,
                this.gameConf.user.simpleAttackMax 
            )
            this.monsterAttack()
        },

        onSpecialAttack(){
            this.userAttack(
                this.gameConf.user.specialAttackMin,
                this.gameConf.user.specialAttackMax 
            )
            this.monsterAttack()
        },

        onHeal(){
            const heal = this.getRamdome(                
                this.gameConf.user.healMin,
                this.gameConf.user.healMax 
            )

            if (this.userHelath + heal > 100) {
                this.userHelath = 100
            }
            else {
                this.addGameLog('You', 'Heal', '', heal)
                this.monsterAttack(2,6)
                this.userAttack(
                    this.gameConf.user.simpleAttackMin,
                    this.gameConf.user.simpleAttackMax 
                )
            }

        },
        onSurrender(){
            this.addGameLog('You', 'Surrender', 'Monster', '')
            this.gameConf.winner = 'Monster'
        },
        resteGame(){
            this.gameConf.attackCount = 0
            this.gameConf.yourTurn = true
            this.gameConf.winner = ''
            this.userHelath = 100
            this.monsterHealth = 100
            this.gameLog = []
        },

        addGameLog(who, event, whom, by){
            this.gameLog.push({
                who, event, whom, by
            })
        }
    }

});


app.mount('#app')