const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const dotenv = require('dotenv').config();
const firebase = require('firebase');
const firebaseConfig= {
    apiKey: process.env.FIRE_APIKEY,
    authDomain: process.env.FIRE_NAME+".firebaseapp.com",
    databaseURL: "https://"+process.env.FIRE_NAME+"-default-rtdb.firebaseio.com",
    projectId: process.env.FIRE_NAME,
    storageBucket: process.env.FIRE_NAME+".appspot.com",
    messagingSenderId: process.env.MSI,
    appId: process.env.FIRE_APPID,
    measurementId: process.env.FIRE_MA
  };
const app=firebase.initializeApp(firebaseConfig);
let last;
let watching={title:"",notas:[],data:""};
const discordBotKey=process.env.BOTKEY;
url=[
    'https://www.imdb.com/search/title?genres=action&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1',
    'https://www.imdb.com/search/title?genres=adventure&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_2',
    'https://www.imdb.com/search/title?genres=animation&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_3',
    'https://www.imdb.com/search/title?genres=biography&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_4',
    'https://www.imdb.com/search/title?genres=comedy&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_5',
    'https://www.imdb.com/search/title?genres=crime&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_6',
    'https://www.imdb.com/search/title?genres=drama&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_7',
    'https://www.imdb.com/search/title?genres=family&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_8',
    'https://www.imdb.com/search/title?genres=fantasy&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_9',
    'https://www.imdb.com/search/title?genres=film_noir&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_10',
    'https://www.imdb.com/search/title?genres=history&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_11',
    'https://www.imdb.com/search/title?genres=horror&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_12',
    'https://www.imdb.com/search/title?genres=music&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_13',
    'https://www.imdb.com/search/title?genres=musical&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_14',
    'https://www.imdb.com/search/title?genres=mystery&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_15',
    'https://www.imdb.com/search/title?genres=romance&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_16',
    'https://www.imdb.com/search/title?genres=sci_fi&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_17',
    'https://www.imdb.com/search/title?genres=sport&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_18',
    'https://www.imdb.com/search/title?genres=thriller&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_19',
    'https://www.imdb.com/search/title?genres=war&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_20',
    'https://www.imdb.com/search/title?genres=western&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=5aab685f-35eb-40f3-95f7-c53f09d542c3&pf_rd_r=VF27Z85NSN2GCAEAAFC7&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_21',
    'https://www.imdb.com/chart/top/?ref_=nv_mv_250'
]
const frasesNota= [
    "Ai você tá trolando com essa nota",
    "Nota mais zoada que esse seu chifre torto",
    "No brasil tá chuvendo mulher mano, para de trolar com nota zoada que tu arranja uma!",
    "Que a sua nota na vida seja zoada que nem essa ai, cornola",
    "Facistas não passarão, nem corno que não sabe dar nota",
    "Que nota massa em, agora para de trolar, vadia pulta",
    "Nota 0 pra sua zoeirinha"
]
const frasesSort=[
    "Categoria meio troll em fiote",
    "Para de zoar meu concorvado, coloca coisa certa ae kk",
    "Amigo, dá uma moderada ai com esses seus comandos",
    "Se tentar foder o sistema o sistema vai te fuder"
]
client.login(discordBotKey);

client.once('ready',()=>{
    console.log("Bot Iniciado!")
})
client.on('message', mensagemR);

function filme(op){
    return fetch(`${url[op]}`).then(
        r=>r.text());     
}
async function getMovie(op){
    let sortedMovies=[];
    let sortedOne
    if(op==22){
        op=Math.floor(Math.random() * 21)
    }
   await filme(op).then(b=>{
        const $=cheerio.load(b);
         $('.lister-item').each((i,element)=>{
            const $element = $(element);
            const imgurl = $element.find('.lister-item-image a img.loadlate').attr('loadlate');
            const title = $element.find('.lister-item-content .lister-item-header a').text();
            const rating= $element.find('.lister-item-content .ratings-bar .inline-block.ratings-imdb-rating strong').text();
            const ano = $element.find('.lister-item-content .lister-item-header span.lister-item-year').text();
            const metarating = $element.find('.lister-item-content .ratings-bar .inline-block.ratings-metascore span.metascore').text();
            sortedMovies.push({title,ano,imgurl,rating,metarating})
        })
        const rdNum=Math.floor(Math.random() * sortedMovies.length);
        sortedOne=sortedMovies[rdNum];;
    });
    return(sortedOne);
}

async function mensagemR(msg){
    if(msg.channel.id==process.env.ROOMKEY){
        if (msg.content.startsWith("rf")){ //sortear filme
            let opi = msg.content.substr(3);
            if(!opi.length){
                msg.channel.send("Informações burras detectadas no comando!!");
                return;
            }
            opi = parseInt(opi,10)||undefined;
            if(opi==undefined){
                const rdNum=Math.floor(Math.random() * frasesSort.length);
                await msg.channel.send(frasesSort[rdNum])
                return;
            }
            console.log(opi);
            let recFilme;
            recFilme=await getMovie(opi-1);
            const embed = new Discord.MessageEmbed()
                .setTitle(recFilme.title+" - "+recFilme.ano)
                .setColor(0x00AE86)
                .setImage(recFilme.imgurl)
                .addFields({ name: '\u200b', value: '\u200b' })
                .addFields({name:"Nota do IMDB:", value:recFilme.rating||"sem notas"})
                .addFields({name:"Nota MetaScore", value:recFilme.metarating||"sem notas"})
            last=recFilme;
            await msg.channel.send(embed);
            
        }
        else if (msg.content=="bn"){ //boa noite
            await msg.reply("Boa noite filho")
        }else if (msg.content=="ff"){ //boa noite
            await msg.reply("'F' for respecr, pela net do murilão")
        }
        else if(msg.content=="op"){ //opções
            const embed = new Discord.MessageEmbed()
                .setTitle("Gêneros")
                .setColor(0xE70303)
                .addFields({name:'Aventura', value:1, inline:true})
                .addFields({name:'Aventura', value:2, inline:true})
                .addFields({name:'Animação', value:3, inline:true})

                .addFields({name:'Biografia', value:4, inline:true})
                .addFields({name:'Comédia ', value:5, inline:true})
                .addFields({name:'Crime', value:6, inline:true})

                .addFields({name:'Drama', value:7, inline:true})
                .addFields({name:'FamilyFriendly', value:8, inline:true})
                .addFields({name:'Fantasia', value:9, inline:true})

                .addFields({name:'Film-Noir', value:10, inline:true})
                .addFields({name:'História', value:11, inline:true})
                .addFields({name:'Terror', value:12, inline:true})

                .addFields({name:'Musica', value:13, inline:true})
                .addFields({name:'Musical', value:14, inline:true})
                .addFields({name:'Mistério', value:15, inline:true})

                .addFields({name:'Romance', value:16, inline:true})
                .addFields({name:'Ficção Cientifica', value:17, inline:true})
                .addFields({name:'Sport', value:18, inline:true})

                .addFields({name:'Suspense', value:19, inline:true})
                .addFields({name:'Guerra', value:20, inline:true})
                .addFields({name:'Faroeste', value:21, inline:true})
                .addFields({ name: '\u200b', value: '\u200b' })
                .addFields({name:'Top 250', value:22, inline:true})
                .addFields({name:'Aleatório', value:23, inline:true})
            await msg.channel.send(embed)
        }else if(msg.content=="cmd"){ //comandos
            const embed= new Discord.MessageEmbed()
                .setTitle("Comandos")
                .setColor(0x44BA10)
                .addFields({name:'Sortear filme', value:"`rf <opção>`"})
                .addFields({name:'Ver opções para sorteio', value:"`op`"})
                .addFields({name:'Selecionar filme sorteado', value:"`ok`"})
                .addFields({name:'Dar nota para o filme selecionado', value:"`nt <nota>`"})
                .addFields({name:'Ver as notas do filme atual', value:"`ver`"})
                .addFields({name:'Salvar tudo no banco de dados', value:"`save`"})
                .addFields({name:'Ver todo o histórico de filmes', value:"`verall`"})
                .addFields({name:'Receber um boa noite', value:"`bn`"})
            await msg.channel.send(embed);
        }else if(msg.content=="ok"){ //bora assistir
            if(last==undefined){
                await msg.channel.send("Nenhum filme sorteado, corno!")
                return
            }
            const data=new Date();
            watching.title=last.title;
            watching.data=data.getDate()+"/"+data.getMonth()+1+"/"+data.getFullYear();
            watching.notas=[];
            last=undefined;
            await msg.channel.send("Assistindo: "+watching.title);
            

        }else if(msg.content.startsWith('nt')){ //dar nota
            let nota = msg.content.substr(3);
            const jaja=watching.notas.find(e=>e.id==msg.author.id);
            if(jaja!=undefined){
                await msg.reply("Tu já votou rapá")
                return;
            }
            if(!nota.length){
                await msg.channel.send("Informações burras detectadas no comando!!");
                return;
            }
            if(watching.title.length==0){
                await msg.channel.send("Nenhum filme está sendo assistido!");
                return;
            }
            nota=parseFloat(nota,10)||undefined;
            if(nota>10 || nota<0.001 || nota==undefined){
                const rdNum=Math.floor(Math.random() * frasesNota.length);
                await msg.channel.send(frasesNota[rdNum]) 
                return;
            }

            watching.notas.push({nome:msg.author.username,nota:nota, id:msg.author.id});
            await msg.reply("Nota enviada!")
        }else if(msg.content=="ver"){
            let media=0;
            if(watching.title.length==0){
                await msg.channel.send("Nenhum filme está sendo assistido!");
                return;
            }
            if(watching.notas.length==0){
                await msg.channel.send("Nenhuma nota foi enviada!");
                return;
            }
            const embed= new Discord.MessageEmbed()
                .setTitle("Notas de '"+watching.title+"'")
                .setColor(0xFF00E1)
                watching.notas.forEach(e=>{
                    embed.addFields({name:e.nome,value:e.nota});
                    media+=e.nota;
                });
                media=media/watching.notas.length;
                embed.addFields({ name: '\u200b', value: '\u200b' })
                embed.addFields({name:"Média das notas:",value:media})

                console.log(watching);
            await msg.channel.send(embed);
            
        }else if(msg.content=="save"){
            if(watching.title.length==0){
                await msg.channel.send("Nenhum filme está sendo assistido!");
                return;
            }
            if(watching.notas.length==0){
                await msg.channel.send("Nenhuma nota foi enviada!");
                return;
            }
                app.database().ref('filmes').push({
                  "nome":watching.title,
                  "notas":watching.notas,
                  "data":watching.data

                },()=>{
                    watching.title="";
                    watching.notas=[];
                    msg.channel.send("Salvo, safe, safe!");
                });
    }
    else if(msg.content=="verall"){
        const embed= new Discord.MessageEmbed()
                .setTitle("Histórico")
                .setColor(0xFF00E1)
        function ler(){  
             
            app.database().ref('filmes').on('child_added',s=>{
                const nomefilme=s.val().nome;
                const datafilme=s.val().data
                embed.addFields({name:nomefilme,value:"Visto em: "+datafilme});
                embed.addFields({name:"Notas",value:'\u200b'})
                const nott=s.val().notas;
                nott.forEach((e,i)=>{
                    const nota=e.nota || undefined;
                    const nomevot=e.nome ||undefined;

                    embed.addFields({name:nomevot,value:nota, inline:true})
                })
                embed.addFields({ name: '\u200b', value: '\u200b' })
            })
            
         }
        await ler();
        setTimeout(async()=>{await msg.channel.send(embed)},1500)

    }
        }

    }

