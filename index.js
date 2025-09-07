// Hii ni faili kuu ya SILATRIX MD WhatsApp Bot
require('./settings')

// Vipodozi vya mfumo
const chalk = require('chalk')
const { Boom } = require('@hapi/boom')
const FileType = require('file-type')
const pathModule = require('path')
const axios = require('axios')

const { shughuliZaUjumbe, shughuliZaMabadilikoYaKikundi, shughuliZaStatus, vipengele, wekaVipengele } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await: awaitFn, sleep, reSize } = require('./lib/myfunc')

// Baileys - itumie kwa kufunga na kufungua
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require('@whiskeysockets/baileys')

const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Kiungo cha WhatsApp Channel
global.kiungoChaWhatsApp = "https://whatsapp.com/channel/0029Vb6DeKwCHDygxt0RXh0L";

// Hifadhi
const hifadhi = {
    ujumbe: {},
    anwani: {},
    mijadala: {},
    metadataYaVikundi: async (jid) => {
        return {}
    },
    funga: function(ev) {
        ev.on('messages.upsert', ({ messages }) => {
            messages.forEach(ujumbe => {
                if (ujumbe.key && ujumbe.key.remoteJid) {
                    this.ujumbe[ujumbe.key.remoteJid] = this.ujumbe[ujumbe.key.remoteJid] || {}
                    this.ujumbe[ujumbe.key.remoteJid][ujumbe.key.id] = ujumbe
                }
            })
        })
        
        ev.on('contacts.update', (anwani) => {
            anwani.forEach(mawasiliano => {
                if (mawasiliano.id) {
                    this.anwani[mawasiliano.id] = mawasiliano
                }
            })
        })
        
        ev.on('chats.set', (mijadala) => {
            this.mijadala = mijadala
        })
    },
    pakuaUjumbe: async (jid, kitambulisho) => {
        return this.ujumbe[jid]?.[kitambulisho] || null
    }
}

let nambaYaSimu = "255789661031" // Namba ya simu ya msingi, inaweza kubadilishwa na mtumiaji
let mmiliki = JSON.parse(fs.readFileSync('./data/mmiliki.json'))

global.jinaLaBoti = "SILATRIX MD 👑"
global.emojiYaMandhari = "👑"
global.kiungoChaKituo = global.kiungoChaWhatsApp

const mipangilio = require('./settings')
const msimboWaKuunganisha = !!nambaYaSimu || process.argv.includes("--pairing-code")
const tumiaRununu = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const swali = (maandishi) => {
    if (rl) {
        return new Promise((tatua) => rl.question(maandishi, tatua))
    } else {
        return Promise.resolve(mipangilio.nambaYaMmiliki || nambaYaSimu)
    }
}

// Ujumbe wa kukaribisha
async function undaUjumbeWaKaribisha(kitambulishoChaMtumiaji) {
    const bangoLaKifalme = `
╔══════════════════════════════════╗
║                                  ║
║   🏰 *KARIBU KATIKA SILATRIX MD* 🏰  ║
║                                  ║
╚══════════════════════════════════╝

👑 *Habarini, mpendwa mtumiaji!* 👑

Umepokea mwaliko wa kutumia *SILATRIX MD*!...

⏳ *Muda wa Sasa:* ${new Date().toLocaleString('sw-TZ')}

╔══════════════════════════════════╗
║       *VYOMBO VYETU*          ║
╚══════════════════════════════════╝
📢 *Kituo cha WhatsApp:* ${global.kiungoChaWhatsApp}
📢 *Kikundi cha WhatsApp:* https://chat.whatsapp.com/FJaYH3HS1rv5pQeGOmKtbM
📡 *Kituo cha Telegram:* https://t.me/chawatech
🎥 *Kituo cha YouTube:* https://www.youtube.com/@Silatrix22
`;

    const vifungo = [
        {
            kifungoChaUrl: {
                maandishiYaKuonyesha: "👑 Jiunge na Kituo",
                url: global.kiungoChaWhatsApp
            }
        },
        {
            kifungoChaUrl: {
                maandishiYaKuonyesha: "💬 Kikundi cha WhatsApp",
                url: "https://chat.whatsapp.com/FJaYH3HS1rv5pQeGOmKtbM"
            }
        },
        {
            kifungoChaUrl: {
                maandishiYaKuonyesha: "📡 Telegram",
                url: "https://t.me/+RyHOondjwZdkZDY0"
            }
        },
        {
            kifungoChaUrl: {
                maandishiYaKuonyesha: "🎥 YouTube",
                url: "https://www.youtube.com/@rich_bess"
            }
        },
        {
            kifungoChaJibuHaraka: {
                maandishiYaKuonyesha: "🛡️ Amri Zote",
                kitambulisho: "!msaada"
            }
        },
        {
            kifungoChaJibuHaraka: {
                maandishiYaKuonyesha: "⚔️ Usaidizi",
                kitambulisho: "!usaidizi"
            }
        }
    ];

    return {
        maandishi: bangoLaKifalme,
        kijachini: "SILA-TECH daima! Safari yako iwe na mafanikio!",
        vifungoVyaKiolezo: vifungo,
        kutaja: [kitambulishoChaMtumiaji],
        maelezoYaMuktadha: {
            alamaYaKusambaza: 999,
            imesambazwa: true,
            habariYaUjumbeWaHabariUliosambazwa: {
                jidYaHabarini: '0029Vb77pP4A89Mje20udJ32@newsletter',
                jinaLaHabarini: 'SILATRIX MD 👑',
                kitambulishoChaUjumbeWaSeva: -1
            }
        }
    };
}

// Anza kutumia SILATRIX MD
async function anzaSILATRIXMD() {
    let { toleo, niJipya } = await fetchLatestBaileysVersion()
    const { hali, hifadhiHati } = await useMultiFileAuthState(`./session`)
    const kacheYaMarudioYaUjumbe = new NodeCache()

    const SILATRIXMD = makeWASocket({
        toleo,
        logger: pino({ kiwango: 'silent' }), 
        printQRInTerminal: !msimboWaKuunganisha,
        kivinjari: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: hali.creds,
            keys: makeCacheableSignalKeyStore(hali.keys, pino({ kiwango: "fatal" }).child({ kiwango: "fatal" })),
        },
        wekaInayeonekanaKwenyeMtandao: true,
        toaKikomoChaHaliYaJuuYaKiungo: true,
        pataUjumbe: async (ufunguo) => {
            let jid = jidNormalizedUser(ufunguo.remoteJid)
            let ujumbe = await hifadhi.pakuaUjumbe(jid, ufunguo.id)
            return ujumbe?.message || ""
        },
        kacheYaMarudioYaUjumbe,
        mudaWaKukimiaMwishoWaSwali: undefined,
    })

    hifadhi.funga(SILATRIXMD.ev)

    SILATRIXMD.ev.on('messages.upsert', async sasishoLaMijadala => {
        try {
            const mek = sasishoLaMijadala.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ujumbeWaMuda') ? mek.message.ujumbeWaMuda.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await shughuliZaStatus(SILATRIXMD, sasishoLaMijadala);
                return;
            }
            if (!SILATRIXMD.public && !mek.key.fromMe && sasishoLaMijadala.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            try {
                await shughuliZaUjumbe(SILATRIXMD, sasishoLaMijadala, true)
            } catch (hitilafu) {
                console.error("Hitilafu ya Amri:", hitilafu)
                if (mek.key && mek.key.remoteJid) {
                    await SILATRIXMD.sendMessage(mek.key.remoteJid, { 
                        text: `⚠️ Amri Imeshindwa!\n\nJiunge na kituo chetu kwa sasisho: ${global.kiungoChaWhatsApp}`,
                        maelezoYaMuktadha: {
                            alamaYaKusambaza: 1,
                            imesambazwa: true,
                            habariYaUjumbeWaHabariUliosambazwa: {
                                jidYaHabarini: '',
                                jinaLaHabarini: 'SILATRIX MD 👑',
                                kitambulishoChaUjumbeWaSeva: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (hitilafu) {
            console.error("Hitilafu ya Jukwaa:", hitilafu)
        }
    })

    SILATRIXMD.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    SILATRIXMD.ev.on('contacts.update', sasisho => {
        for (let mawasiliano of sasisho) {
            let kitambulisho = SILATRIXMD.decodeJid(mawasiliano.id)
            if (hifadhi && hifadhi.anwani) hifadhi.anwani[kitambulisho] = { kitambulisho, jina: mawasiliano.notify }
        }
    })

    SILATRIXMD.pataJina = (jid, bilaMawasiliano = false) => {
        kitambulisho = SILATRIXMD.decodeJid(jid)
        bilaMawasiliano = SILATRIXMD.bilaMawasiliano || bilaMawasiliano 
        let v
        if (kitambulisho.endsWith("@g.us")) return new Promise(async (tatua) => {
            v = hifadhi.anwani[kitambulisho] || {}
            if (!(v.jina || v.mada)) v = SILATRIXMD.metadataYaVikundi(kitambulisho) || {}
            tatua(v.jina || v.mada || PhoneNumber('+' + kitambulisho.replace('@s.whatsapp.net', '')).getNumber('kimataifa'))
        })
        else v = kitambulisho === '0@s.whatsapp.net' ? {
            kitambulisho,
            jina: 'WhatsApp'
        } : kitambulisho === SILATRIXMD.decodeJid(SILATRIXMD.user.kitambulisho) ?
            SILATRIXMD.user :
            (hifadhi.anwani[kitambulisho] || {})
        return (bilaMawasiliano ? '' : v.jina) || v.mada || v.jinaLilithibitishwa || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('kimataifa')
    }

    SILATRIXMD.public = true
    SILATRIXMD.serializeM = (m) => smsg(SILATRIXMD, m, hifadhi)

    if (msimboWaKuunganisha && !SILATRIXMD.authState.creds.registered) {
        if (tumiaRununu) throw new Error('Haiwezi kutumia msimbo wa kuunganisha na API ya rununu')

        let nambaYaSimu
        if (!!global.nambaYaSimu) {
            nambaYaSimu = global.nambaYaSimu
        } else {
            nambaYaSimu = await swali(chalk.bgBlack(chalk.greenBright(` weka namba yako ya WhatsApp \nMfumo: 255612491551 (bila + au nafasi) : `)))
        }

        nambaYaSimu = nambaYaSimu.replace(/[^0-9]/g, '')

        const pn = require('awesome-phonenumber');
        if (!pn('+' + nambaYaSimu).isValid()) {
            console.log(chalk.red('Namba siyo sahihi. weka namba yako kamili (mfano: 255612491551) bila + au nafasi.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let msimbo = await SILATRIXMD.requestPairingCode(nambaYaSimu)
                msimbo = msimbo?.match(/.{1,4}/g)?.join("-") || msimbo
                console.log(chalk.black(chalk.bgGreen(`Msimbo wako wa Kuunganisha : `)), chalk.black(chalk.white(msimbo)))
                console.log(chalk.yellow(`\nTafadhali weka msimbo huu kwenye WhatsApp yako:\n1. Fungua WhatsApp\n2. Nenda kwenye Mipangilio > Vifaa Vilivyounganishwa\n3. Bofya "Unganisha Kifaa"\n4. Weka msimbo ulioonyeshwa hapo juu`))
            } catch (hitilafu) {
                console.error('Hitilafu ya Kuunganisha:', hitilafu)
                console.log(chalk.red('Imeshindwa kupata msimbo wa kuunganisha. Tafadhali angalia namba yako na ujaribu tena.'))
            }
        }, 3000)
    }

    SILATRIXMD.ev.on('connection.update', async (s) => {
        const { muunganisho, kukatwaMwisho } = s
        if (muunganisho == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`👑 SILATRIX MD Imeunganishwa kwa => ` + JSON.stringify(SILATRIXMD.user, null, 2)))
            
            // Tumia ujumbe wa karibisha kwa mmiliki wa boti
            const nambaYaBoti = SILATRIXMD.user.kitambulisho.split(':')[0] + '@s.whatsapp.net';
            try {
                const ujumbeWaKaribisha = await undaUjumbeWaKaribisha(nambaYaBoti);
                await SILATRIXMD.sendMessage(nambaYaBoti, ujumbeWaKaribisha);
                
                // Tangazo la ziada
                await SILATRIXMD.sendMessage(nambaYaBoti, {
                    text: `📢 *Tangazo Muhimu*\n\n` +
                          `SILATRIX MD sasa ipo tayari kutumika!\n\n` +
                          `Tumia *.msaada* kuona amri zote\n` +
                          `Jiunge na vyombo vyetu:\n` +
                          `Kituo cha WhatsApp: ${global.kiungoChaWhatsApp}\n` +
                          `Kikundi cha WhatsApp: https://chat.whatsapp.com/FJaYH3HS1rv5pQeGOmKtbM\n` +
                          `Telegram: https://t.me/+RyHOondjwZdkZDY0\n` +
                          `YouTube: https://youtube.com/@rich_bess`,

                    vifungoVyaKiolezo: [{
                        index: 1, 
                        kifungoChaUrl: {
                            maandishiYaKuonyesha: '👑 Jiunge na Kituo',
                            url: global.kiungoChaWhatsApp
                        }
                    }],
                    maelezoYaMuktadha: {
                        alamaYaKusambaza: 999,
                        imesambazwa: true
                    }
                });
            } catch (hitilafu) {
                console.error('Hitilafu ya Tangazo:', hitilafu);
            }

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.jinaLaBoti || 'SILATRIX MD 👑'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================ SILATRIX MD ================ >`))
            console.log(chalk.magenta(`\n${global.emojiYaMandhari || '👑'} Mwanzilishi: SILA TECH`))
            console.log(chalk.magenta(`${global.emojiYaMandhari || '👑'} Msaidizi: Prince favour`))
            console.log(chalk.magenta(`${global.emojiYaMandhari || '👑'} Namba ya Mwenyeji: ${mmiliki}`))
            console.log(chalk.green(`${global.emojiYaMandhari || '👑'} SILATRIX MD imefanikiwa kuanzishwa! 👑`))
            console.log(chalk.blue(`📢 Kituo cha WhatsApp: ${global.kiungoChaWhatsApp}`))
        }
        if (
            muunganisho === "close" &&
            kukatwaMwisho &&
            kukatwaMwisho.hitilafu &&
            kukatwaMwisho.hitilafu.output.statusCode != 401
        ) {
            anzaSILATRIXMD()
        }
    })

    SILATRIXMD.ev.on('creds.update', hifadhiHati)
    
    SILATRIXMD.ev.on('group-participants.update', async (sasisho) => {
        await shughuliZaMabadilikoYaKikundi(SILATRIXMD, sasisho);
    });

    // Tumia ujumbe wa karibisha kwa watumiaji wapya
    SILATRIXMD.ev.on('contacts.upsert', async (anwani) => {
        for (const mawasiliano of anwani) {
            if (mawasiliano.status === 'add') {
                try {
                    const kitambulishoChaMtumiaji = SILATRIXMD.decodeJid(mawasiliano.kitambulisho);
                    const ujumbeWaKaribisha = await undaUjumbeWaKaribisha(kitambulishoChaMtumiaji);
                    await SILATRIXMD.sendMessage(kitambulishoChaMtumiaji, ujumbeWaKaribisha);
                } catch (hitilafu) {
                    console.error('Hitilafu ya Karibuni:', hitilafu);
                }
            }
        }
    });

    return SILATRIXMD
}

anzaSILATRIXMD().catch(hitilafu => {
    console.error('Hitilafu Kubwa:', hitilafu)
    process.exit(1)
})
process.on('uncaughtException', (hitilafu) => {
    console.error('Hitilafu Isiyotarajiwa:', hitilafu)
})

process.on('unhandledRejection', (hitilafu) => {
    console.error('Hitilafu ya Kuzuia:', hitilafu)
})

let faili = require.resolve(__filename)
fs.watchFile(faili, () => {
    fs.unwatchFile(faili)
    console.log(chalk.redBright(`👑 Sasisho la SILATRIX MD: ${__filename}`))
    delete require.cache[faili]
    require(faili)
})