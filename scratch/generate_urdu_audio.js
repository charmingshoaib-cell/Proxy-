const https = require('https');
const fs = require('fs');
const path = require('path');

// Urdu story text (split into chunks as Google TTS has a limit)
const storyParts = [
  "السلام علیکم پیارے بچو! آج ہم آپ کے لیے لائے ہیں ایک بہت ہی خوبصورت اور جادوئی کہانی! کیا آپ تیار ہیں ایک جادوئی سفر پر جانے کے لیے؟ تو چلیے شروع کرتے ہیں جادوئی جنگل کی کہانی!",
  "ایک بہت پرانے زمانے کی بات ہے۔ ایک گھنے جنگل میں فریدو نام کا ایک چھوٹا لومڑی رہتا تھا۔ فریدو بہت شرارتی تھا — ہمیشہ نئی جگہیں ڈھونڈتا، نئی باتیں سیکھتا۔",
  "ایک دن فریدو نے جنگل کے بیچ میں ایک چمکتا ہوا دروازہ دیکھا! دروازے پر لکھا تھا: صرف بہادر دل والے اندر آ سکتے ہیں۔ فریدو نے سوچا — میں بہادر ہوں! میں ضرور اندر جاؤں گا!",
  "اندر جا کر فریدو نے دیکھا — ایک بالکل الگ دنیا! بڑے بڑے رنگ برنگے مشروم، آسمان میں اڑتے ستارے، جادوئی تتلیاں جو باتیں کر سکتی تھیں!",
  "ایک تتلی نے کہا: فریدو! تم آ گئے! ہمیں تمہاری ضرورت تھی! تتلی نے بتایا کہ اس جادوئی دنیا کا جادوئی درخت بیمار ہو گیا ہے۔ اور صرف ایک بہادر دل والا اسے بچا سکتا ہے!",
  "فریدو نے مشکلوں کا سامنا کیا۔ پہاڑ بہت اونچا تھا — لیکن فریدو رکا نہیں۔ پھول کے پاس کانٹے تھے — لیکن فریدو گھبرایا نہیں۔",
  "آخر میں فریدو نے جادوئی درخت کو پانی پلایا اور کہا: تم بہتر ہو جاؤ! ہم سب تم سے محبت کرتے ہیں! درخت چمکنے لگا! ساری دنیا خوشیوں سے بھر گئی!",
  "تتلی نے کہا: فریدو! تم نے ہم سب کو بچا لیا! تم سچے بہادر ہو! فریدو مسکرایا اور گھر واپس آ گیا۔ آج کی کہانی کا سبق یہ ہے: ہمت اور محبت سے ہر مشکل حل ہو جاتی ہے! کبھی ہار مت مانو! اللہ حافظ!"
];

const outputDir = 'C:\\Users\\shoaib\\Desktop\\KidsStoryAudio';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function downloadAudio(text, index) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=ur&client=tw-ob`;
    const filePath = path.join(outputDir, `part_${String(index).padStart(2, '0')}.mp3`);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const file = fs.createWriteStream(filePath);
    https.get(url, options, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Part ${index + 1} downloaded: ${filePath}`);
          resolve(filePath);
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode} for part ${index + 1}`));
      }
    }).on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function generateAll() {
  console.log('🎙️ Generating Urdu audio parts...\n');
  const files = [];
  for (let i = 0; i < storyParts.length; i++) {
    try {
      const file = await downloadAudio(storyParts[i], i);
      files.push(file);
      await new Promise(r => setTimeout(r, 1000)); // small delay between requests
    } catch (err) {
      console.error(`❌ Error on part ${i + 1}: ${err.message}`);
    }
  }
  
  console.log(`\n🎉 Done! ${files.length} audio files saved to:`);
  console.log(`📁 ${outputDir}`);
  console.log('\n📋 Files:');
  files.forEach(f => console.log('   ' + path.basename(f)));
  console.log('\n💡 Tip: Import all MP3 files into CapCut to combine into one audio!');
}

generateAll();
