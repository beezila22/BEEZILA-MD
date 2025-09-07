const fs = require('fs');
const path = require('path');

// Hifadhi ya vipengele
const vipengeleFile = './data/vipengele.json';
let vipengele = {};

// Pakua vipengele ikiwa faili ipo
if (fs.existsSync(vipengeleFile)) {
    vipengele = JSON.parse(fs.readFileSync(vipengeleFile));
} else {
    // Vipengele vya msingi
    vipengele = {
        autoviewStatus: true,
        antidelete: true,
        downloadMedia: true,
        viewOnceDownload: true,
        fakeRecording: false,
        alwaysOnline: true,
        fakeTyping: false,
        autoLikeStatus: true,
        aiFeatures: true,
        chatGpt: true,
        downloadStatus: true,
        autoprofile: false,
        chatbot: true,
        autoBio: false,
        autoReact: true,
        autoRead: true,
        autoSaveContacts: true,
        antiban: true,
        antiWhatsAppBan: true
    };
    wekaVipengele();
}

// Hifadhi vipengele
function wekaVipengele() {
    fs.writeFileSync(vipengeleFile, JSON.stringify(vipengele, null, 2));
}

// Usimamizi wa hali za statusi
async function shughuliZaStatus(client, chatUpdate) {
    if (!vipengele.autoviewStatus) return;
    
    try {
        const mek = chatUpdate.messages[0];
        if (mek.key && mek.key.remoteJid === 'status@broadcast') {
            // Angalia statusi moja kwa moja
            await client.readMessages([mek.key]);
            
            if (vipengele.autoLikeStatus) {
                // Penda statusi moja kwa moja
                await client.sendMessage(mek.key.remoteJid, {
                    react: {
                        text: "❤️",
                        key: mek.key
                    }
                });
            }
        }
    } catch (hitilafu) {
        console.error('Hitilafu ya usimamizi wa statusi:', hitilafu);
    }
}

// Kuzuia kufuta ujumbe
const ujumbeUliyofutwa = new Map();
async function shughuliZaKufuta(client, tukio) {
    if (!vipengele.antidelete) return;
    
    try {
        const { key, ujumbe } = tukio;
        ujumbeUliyofutwa.set(key.id, {
            ujumbe: ujumbe,
            wakati: Date.now(),
            mtumaji: key.fromMe ? 'Wewe' : await client.pataJina(key.participant || key.remoteJid)
        });
        
        // Arifu kuhusu ujumbe uliofutwa
        if (!key.fromMe) {
            const ujumbeUlfutwa = ujumbeUliyofutwa.get(key.id);
            await client.sendMessage(key.remoteJid, {
                text: `🗑️ Ujumbe umefutwa na ${ujumbeUlfutwa.mtumaji}\n\n"${ujumbeUlfutwa.ujumbe.mazungumzo || 'Ujumbe wa media'}"`
            });
        }
    } catch (hitilafu) {
        console.error('Hitilafu ya usimamizi wa kufuta:', hitilafu);
    }
}

// Pakua media
async function pakuaMedia(client, ujumbe, aina) {
    if (!vipengele.downloadMedia) return null;
    
    try {
        const buffer = await client.downloadMediaMessage(ujumbe);
        const wakati = new Date().getTime();
        const jinaFaili = `./media/${aina}_${wakati}.${aina === 'picha' ? 'jpg' : 'mp4'}`;
        
        fs.writeFileSync(jinaFaili, buffer);
        return jinaFaili;
    } catch (hitilafu) {
        console.error('Hitilafu ya kupakua:', hitilafu);
        return null;
    }
}

// Pakua ujumbe wa kuona mara moja
async function shughuliZaKuonaMaraMoja(ujumbe, client) {
    if (!vipengele.viewOnceDownload) return;
    
    try {
        if (ujumbe.message?.viewOnceMessageV2) {
            const buffer = await client.downloadMediaMessage(ujumbe);
            const wakati = new Date().getTime();
            const jinaFaili = `./media/kuonamaramoja_${wakati}.jpg`;
            
            fs.writeFileSync(jinaFaili, buffer);
            
            // Tumia kwa mmiliki au hifadhi
            const jidYaMmiliki = 'owner_jid_here@s.whatsapp.net';
            await client.sendMessage(jidYaMmiliki, {
                text: `📸 Picha ya kuona mara moja imepakuliwa!`,
                document: fs.readFileSync(jinaFaili),
                fileName: `kuona_mara_moja_${wakati}.jpg`,
                mimetype: 'image/jpeg'
            });
        }
    } catch (hitilafu) {
        console.error('Hitilafu ya usimamizi wa kuona mara moja:', hitilafu);
    }
}

// Toa utendaji wote
module.exports = {
    shughuliZaUjumbe: async (client, chatUpdate, niAmri) => {
        // Mantiki kuu ya usimamizi wa ujumbe hapa
        const ujumbe = chatUpdate.messages[0];
        
        // Shughuli za ujumbe wa kuona mara moja
        if (vipengele.viewOnceDownload) {
            await shughuliZaKuonaMaraMoja(ujumbe, client);
        }
        
        // Msimbo wako uliopo wa usimamizi wa ujumbe
        // ...
    },
    
    shughuliZaMabadilikoYaKikundi: async (client, sasisho) => {
        // Usimamizi wa mabadiliko ya washiriki wa kikundi
    },
    
    shughuliZaStatus,
    shughuliZaKufuta,
    vipengele,
    wekaVipengele
};