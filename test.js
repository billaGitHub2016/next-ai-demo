const content = `<h4>美日关系的最新报道</h4><p>以下是关于美日关系的最新报道：</p><ol>
<li>
  <p><strong>菲律宾与日本加强防务合作：</strong>菲律宾众议院议长费迪南德·马丁·罗穆亚尔德斯（Ferdinand Martin Romualdez）和日本议长福士郎·野中（Fukushiro Nukaga）承诺扩大和加强双边关系以及与美国的三边关系。</p>
  <p>来源: <a href="https://www.msn.com/en-ph/news/other/ph-japan-speakers-to-boost-defense-ties-expand-trilateral-ties-with-us/ar-BB1oqcub">MSN</a></p>
</li>
<li>
  <p><strong>日本首相岸田文雄考虑访问德国：</strong>日本首相岸田文雄（Fumio Kishida）正在考虑在7月初访问德国，与德国总理奥拉夫·朔尔茨（Olaf Scholz）会面，并参加在美国举行的北约峰会。</p>
  <p>来源: <a href="https://www.msn.com/en-gb/news/world/japan-pm-kishida-mulls-germany-visit-to-meet-scholz-early-july-nhk-reports/ar-BB1ooT7X">MSN</a></p>
</li>
<li>
  <p><strong>美日韩联合军事演习：</strong>美国、韩国和日本通过新的联合军事演习向外界传递了明确的信息，展示了三国在防御规则方面的共同努力。</p>
  <p>来源: <a href="https://www.scmp.com/news/china/military/article/3265795/us-south-korea-and-japan-send-clear-message-new-joint-military-drill">South China Morning Post</a></p>
</li>
<li>
  <p><strong>美日韩三边防务合作：</strong>日本、韩国和美国在亚洲顶级地区安全会议上宣布了一系列新举措，这些举措将有助于正式化三国之间日益增长的三边防务合作。</p>
  <p>来源: <a href="https://www.japantimes.co.jp/news/2024/06/02/japan/politics/south-korea-japan-us-trilateral-shangri-la/">Japan Times</a></p>
</li>
<li>
  <p><strong>美日韩加强合作应对中国：</strong>《华盛顿邮报》发表了一篇评论文章，讨论了美日韩三国在经济安全、情报共享和军事准备方面的合作，以应对中国的威胁。</p>
  <p>来源: <a href="https://www.washingtonpost.com/opinions/2024/05/27/united-states-japan-south-korea-relationship-deepens/">Washington Post</a></p>
</li>
<li>
  <p><strong>日本派遣防务官员到美国海军进行轨道炮开发：</strong>日本派遣了一名防务官员到美国海军，以利用其经验开发轨道炮，这种武器使用电磁力以高速发射子弹。</p>
  <p>来源: <a href="https://www.japantimes.co.jp/news/2024/05/21/japan/japan-defense-railgun-development/">Japan Times</a></p>
</li>
</ol><p>这些报道展示了美日关系在防务合作、三边合作和技术开发等多个方面的最新动态。</p>`

// const regex = /<li>\n.*<strong>(.*?)：<\/strong>.*\n.*\n.*<\/li>/g; // 匹配新闻链接， 例子：<a href="https://www.bloomberg.com/news/articles/2024-06-17/us-suspends-mexico-avocado-shipments-due-to-inspector-incident">Bloomberg</a>
// //?<strong>(.*?)<\/strong>(<p>来源: <a[^>]*>(.*?)<\/a><\/p>)
// const matches = content.matchAll(regex);

// console.log('matches = ', matches)
// for (const match of matches) {
//   // let aTag = match[0]
//   // const channel = match[1]
//   // const newQuestion = `{${channel}}对{${chat.desc}}具体报道是什么`
//   // // aTag = aTag.replace(/href="\S+"/, `href="javascript:void(0)" onClick="dispatchNewsDetailEvent('${newQuestion}')" class="news-detail-link"`);
//   // const pTag = `<p>来源: <span onClick="dispatchNewsDetailEvent('${newQuestion}')" class="news-detail-link">${channel}</span></p>`
//   // content = content.replace(match[0], pTag);
//   // console.log('match[0] = ', match[0])
//   // console.log('match[1] = ', match[1])

//   const aTagRegex = /<p>来源: <a[^>]*>(.*?)<\/a><\/p>/
//   const aTagMatch = aTagRegex.exec(match[0])
//   console.log('aTagMatch = ', aTagMatch)
// }

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const parser = new JSDOM();
// 创建一个新的JSDOM实例并传入HTML字符串
const dom = new JSDOM(content);

// 获取DOM解析后的文档对象
const document = dom.window.document;

// 使用标准的DOM方法查询元素
const paragraphs = document.querySelectorAll('li');
const pTags = document.querySelectorAll('p')

// 打印每个段落的文本内容
pTags.forEach(p => {
  console.log(p.textContent); // 输出: Hello, World!
});

