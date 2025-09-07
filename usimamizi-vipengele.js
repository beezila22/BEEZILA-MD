// usimamizi-vipengele.js
const { vipengele, wekaVipengele } = require('./main');

// Viarishi vya majina ya vipengele
const majinaYaVipengele = {
    'autoview': 'autoviewStatus',
    'antidelete': 'antidelete',
    'download': 'downloadMedia',
    'viewonce': 'viewOnceDownload',
    'fakerecording': 'fakeRecording',
    'alwaysonline': 'alwaysOnline',
    'faketyping': 'fakeTyping',
    'autolike': 'autoLikeStatus',
    'ai': 'aiFeatures',
    'chatgpt': 'chatGpt',
    'downloadstatus': 'downloadStatus',
    'autoprofile': 'autoprofile',
    'chatbot': 'chatbot',
    'autobio': 'autoBio',
    'autoreact': 'autoReact',
    'autoread': 'autoRead',
    'autosave': 'autoSaveContacts',
    'antibun': 'antiban',
    'antiwhatsappban': 'antiWhatsAppBan'
};

// Shughuli za amri ya kudhibiti vipengele
async function shughuliZaAmriYaVipengele(client, ujumbe, hoja) {
    const kipengele = hoja[0]?.toLowerCase();
    const kitendo = hoja[1]?.toLowerCase();
    
    if (!kipengele) {
        // Orodha ya vipengele vyote na hali zake
        let orodhaYaVipengele = "🔧 *USIMAMIZI WA VIPENGEELE*\n\n";
        for (const [ufunguo, thamani] of Object.entries(vipengele)) {
            const hali = thamani ? "✅" : "❌";
            orodhaYaVipengele += `${hali} ${ufunguo}: ${thamani ? 'WASHA' : 'ZIMA'}\n`;
        }
        
        orodhaYaVipengele += "\nTumia: !kipengele <jina> <washa/zima> kubadili hali";
        await client.sendMessage(ujumbe.key.remoteJid, { text: orodhaYaVipengele });
        return;
    }
    
    const ufunguoWaKipengele = majinaYaVipengele[kipengele];
    if (!ufunguoWaKipengele || !vipengele.hasOwnProperty(ufunguoWaKipengele)) {
        await client.sendMessage(ujumbe.key.remoteJid, { 
            text: `❌ Kipengele kisichojulikana: ${kipengele}\nTumia !kipengele kuona vipengele vinavyopatikana.` 
        });
        return;
    }
    
    if (!kitendo || (kitendo !== 'washa' && kitendo !== 'zima')) {
        await client.sendMessage(ujumbe.key.remoteJid, { 
            text: `Hali ya sasa ya ${ufunguoWaKipengele}: ${vipengele[ufunguoWaKipengele] ? 'WASHA' : 'ZIMA'}` 
        });
        return;
    }
    
    const haliMpya = kitendo === 'washa';
    vipengele[ufunguoWaKipengele] = haliMpya;
    wekaVipengele();
    
    await client.sendMessage(ujumbe.key.remoteJid, { 
        text: `✅ ${ufunguoWaKipengele} imewashwa ${haliMpya ? 'WASHA' : 'ZIMA'}` 
    });
}

module.exports = {
    shughuliZaAmriYaVipengele
};