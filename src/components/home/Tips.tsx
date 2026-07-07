export default function Tips() {
  return (
    <>
      <section id="practical" className="relative py-24 bg-card">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-12 reveal show">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-num">— 08</span>
              <span className="eyebrow">Travel Tips · 2026</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black serif leading-tight">行前必读 · 实用信息</h2>
            <div className="section-rule mt-6 mb-5" />
            <p className="text-ink/65 leading-8 text-[15px]">签证、交通、货币、网络与礼仪，出发前花几分钟读一读，少走弯路。</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-10 reveal show">
            <div className="bg-terracotta/5 border-l-2 border-terracotta rounded-r-2xl p-6 flex gap-4">
              <span className="material-symbols-outlined text-terracotta text-2xl">priority_high</span>
              <div>
                <p className="font-bold text-terracottaDark">2026 签证费上调</p>
                <p className="text-[14px] text-ink/70 mt-2 leading-7">
                  自 2026 年 7 月 1 日起，单次入境旅游签证费由 3,000 日元上调至 15,000 日元，多次签上调至 30,000 日元。请预留预算并尽早办理。
                </p>
              </div>
            </div>
            <div className="bg-pine/5 border-l-2 border-pine rounded-r-2xl p-6 flex gap-4">
              <span className="material-symbols-outlined text-pine text-2xl">receipt_long</span>
              <div>
                <p className="font-bold text-pine">2026 退税新制</p>
                <p className="text-[14px] text-ink/70 mt-2 leading-7">
                  自 2026 年 11 月 1 日起，全面改为“先付后退”：购物时先付含税价，离境前在机场退税柜台办理退税，请保留小票与商品。
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 reveal show">
            <details className="info-acc group bg-paper rounded-2xl border hairline overflow-hidden" open>
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <span className="flex items-center gap-3 font-bold text-[17px] serif">
                  <span className="material-symbols-outlined text-pine">badge</span>
                  签证政策（中国游客）
                </span>
                <span className="acc-icon material-symbols-outlined text-ink/50">expand_more</span>
              </summary>
              <div className="px-6 pb-7 pt-0 text-ink/75 text-[15px] leading-8 border-t hairline">
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li>持中国护照赴日需提前办理签证，常见为单次 / 多次旅游签证。</li>
                  <li>日本已全面推行 <strong>eVisa 电子签</strong>，居住在中国的居民可在线申请 15 / 30 天单次旅游签。</li>
                  <li>可通过有资质的代办旅行社或指定使馆代办机构提交材料，一般需在职 / 收入 / 资产等证明。</li>
                  <li><strong className="text-terracotta">重要：</strong>2026 年 7 月 1 日起签证费大幅上调，请提前规划预算与办理时间。</li>
                </ul>
              </div>
            </details>

            <details className="info-acc group bg-paper rounded-2xl border hairline overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <span className="flex items-center gap-3 font-bold text-[17px] serif">
                  <span className="material-symbols-outlined text-pine">train</span>
                  交通出行（JR Pass / IC 卡 / 新干线）
                </span>
                <span className="acc-icon material-symbols-outlined text-ink/50">expand_more</span>
              </summary>
              <div className="px-6 pb-7 pt-0 text-ink/75 text-[15px] leading-8 border-t hairline">
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li><strong>JR Pass 全国版：</strong>7 天约 70,000 日元。仅当行程跨度大时才划算，一般“东京–京都–大阪”单独购票更省钱。</li>
                  <li><strong>IC 交通卡：</strong>Suica、ICOCA、PASMO 可刷地铁、公交、便利店；机场即可购买实体卡，或添加至手机钱包。</li>
                  <li><strong>新干线：</strong>东京–京都约 2.2 小时。携带超大行李（三边合计 &gt;160cm）乘坐东海道 / 山阳 / 九州新干线须提前预约行李位。</li>
                  <li><strong>区域周游券：</strong>关西、北海道、北陆等地有专属 Pass，按行程选择更经济。</li>
                </ul>
              </div>
            </details>

            <details className="info-acc group bg-paper rounded-2xl border hairline overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <span className="flex items-center gap-3 font-bold text-[17px] serif">
                  <span className="material-symbols-outlined text-pine">payments</span>
                  货币 · 消费 · 退税
                </span>
                <span className="acc-icon material-symbols-outlined text-ink/50">expand_more</span>
              </summary>
              <div className="px-6 pb-7 pt-0 text-ink/75 text-[15px] leading-8 border-t hairline">
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li><strong>货币：</strong>日元（JPY）。近年日元汇率处于相对低位，对中国游客而言性价比较高。</li>
                  <li><strong>支付：</strong>大城市普遍支持刷卡与移动支付，PayPay 覆盖广泛，部分商家可直接用支付宝 / 微信；但仍建议随身备少量现金。</li>
                  <li><strong>退税：</strong>2026 年 11 月起改为“先付后退”，离境机场办理，请务必保留购物小票与未拆封商品。</li>
                </ul>
              </div>
            </details>

            <details className="info-acc group bg-paper rounded-2xl border hairline overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <span className="flex items-center gap-3 font-bold text-[17px] serif">
                  <span className="material-symbols-outlined text-pine">wifi</span>
                  网络 · 必备 APP
                </span>
                <span className="acc-icon material-symbols-outlined text-ink/50">expand_more</span>
              </summary>
              <div className="px-6 pb-7 pt-0 text-ink/75 text-[15px] leading-8 border-t hairline">
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li><strong>网络：</strong>推荐 eSIM 或随身 WiFi，落地即用，无需换卡；支持地图导航等常用服务。</li>
                  <li><strong>换乘案内 / Japan Transit：</strong>查询电车、地铁、新干线换乘，支持中文。</li>
                  <li><strong>地图导航：</strong>用于步行 / 公交路线规划，日本地铁换乘信息详尽。</li>
                  <li><strong>PayPay：</strong>覆盖数百万商家的移动支付，扫码消费便利。</li>
                </ul>
              </div>
            </details>

            <details className="info-acc group bg-paper rounded-2xl border hairline overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <span className="flex items-center gap-3 font-bold text-[17px] serif">
                  <span className="material-symbols-outlined text-pine">volunteer_activism</span>
                  礼仪 · 注意事项
                </span>
                <span className="acc-icon material-symbols-outlined text-ink/50">expand_more</span>
              </summary>
              <div className="px-6 pb-7 pt-0 text-ink/75 text-[15px] leading-8 border-t hairline">
                <ul className="mt-4 space-y-2 list-disc list-inside">
                  <li><strong>电车内：</strong>保持手机静音，避免大声通话与喧哗。</li>
                  <li><strong>扶梯：</strong>东京习惯靠左站立、右侧通行；大阪则相反靠右站立。</li>
                  <li><strong>垃圾：</strong>街头垃圾桶较少，建议随身携带袋子将垃圾带回酒店分类丢弃。</li>
                  <li><strong>温泉：</strong>入浴前需先冲洗身体，有纹身者部分温泉可能谢绝入场。</li>
                  <li><strong>神社寺庙：</strong>参拜遵循“二礼二拍一礼”，注意禁止拍照的区域。</li>
                </ul>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section id="foreign" className="relative py-24 bg-paper">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-12 reveal show">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-num">— 09</span>
              <span className="eyebrow">For Foreign Travelers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black serif leading-tight">外国游客关注 · 安心出行</h2>
            <div className="section-rule mt-6 mb-5" />
            <p className="text-ink/65 leading-8 text-[15px]">
              作为外国游客，除了景点与美食，这些“看不见却很关键”的信息更能决定旅程是否顺畅：紧急求助、入境通关、语言沟通、医疗保险、电力网络、行李寄存与自然灾害应对。
            </p>
          </div>

          <div className="mb-14 reveal show">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-terracotta">emergency</span>
              <h3 className="serif font-bold text-xl">紧急联络 · 存进手机</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  iconClass: 'text-terracotta',
                  hoverClass: 'hover:border-terracotta/40',
                  icon: 'local_police',
                  label: 'Police',
                  value: '110',
                  title: '警察',
                  text: '失窃、被盗、交通事故、纠纷报案',
                },
                {
                  iconClass: 'text-terracotta',
                  hoverClass: 'hover:border-terracotta/40',
                  icon: 'local_fire_department',
                  label: 'Fire · EMS',
                  value: '119',
                  title: '火警 · 急救',
                  text: '火灾、突发急病、受伤叫救护车',
                },
                {
                  iconClass: 'text-pine',
                  hoverClass: 'hover:border-pine/40',
                  icon: 'support_agent',
                  label: 'JNTO 24h',
                  value: '050-3816-2787',
                  title: '游客咨询热线',
                  text: '日本旅游局 24 小时·中英韩日，旅游咨询与紧急协助',
                },
                {
                  iconClass: 'text-pine',
                  hoverClass: 'hover:border-pine/40',
                  icon: 'flag',
                  label: 'Consular',
                  value: '+86-10-12308',
                  title: '中国领事保护',
                  text: '外交部全球领事保护与服务应急热线，护照遗失、突发状况求助',
                },
              ].map((item) => (
                <div key={item.title} className={`bg-card rounded-2xl border hairline p-6 transition ${item.hoverClass}`}>
                  <div className={`flex items-center gap-2 mb-3 ${item.iconClass}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span className="text-[12px] tracking-wider uppercase font-semibold">{item.label}</span>
                  </div>
                  <p className="serif font-black text-[26px] text-ink leading-tight">{item.value}</p>
                  <p className="font-semibold text-[14px] mt-3">{item.title}</p>
                  <p className="text-[13px] text-ink/60 leading-6 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-14 reveal show">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-terracotta">qr_code_2</span>
              <h3 className="serif font-bold text-xl">入境通关 · Visit Japan Web</h3>
            </div>
            <div className="bg-card rounded-2xl border hairline p-7 md:p-9">
              <p className="text-[14.5px] text-ink/70 leading-8 mb-7">
                日本政府官方免费系统 <strong>Visit Japan Web</strong>，出发前在线登记，把纸质入境卡与海关申报电子化，落地扫一个二维码即可快速通关，还可用于免税购物。
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  ['01', '注册账号', '出发前用手机注册，录入护照与行程、住宿信息。'],
                  ['02', '填写申报', '完成“入境审查”与“海关申报”两项资料填写。'],
                  ['03', '生成二维码', '系统生成 QR 码，建议截图保存，避免落地无网。'],
                  ['04', '扫码通关', '机场出示 QR 码，走电子闸门快速入境。'],
                ].map(([num, title, text]) => (
                  <div key={num} className="relative">
                    <span className="section-num">{num}</span>
                    <p className="font-bold serif text-[15px] mt-2">{title}</p>
                    <p className="text-[13px] text-ink/60 leading-6 mt-1.5">{text}</p>
                  </div>
                ))}
              </div>
              <p className="text-[12.5px] text-ink/45 leading-6 mt-7 border-t hairline pt-4">
                提示：持中国护照仍需提前办理日本签证；Visit Japan Web 只简化入境手续，不等于签证。免签国家/地区旅客可直接使用。
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14 reveal show">
            {[
              ['power', '电力与设备', '电压 100V，插座为 A 型两脚扁插。东日本（东京）50Hz、西日本（大阪/京都）60Hz。手机、笔电等宽电压设备可直接用；三脚插头需带转换头。'],
              ['luggage', '行李与寄存', '车站硬币寄物柜约 ¥400 起，适合临时寄存。宅急便可把行李从机场送到酒店、或酒店之间转运，轻装游玩更省心。'],
              ['local_convenience_store', '便利店与 ATM', '7-11、罗森、全家普遍营业。Seven Bank ATM 支持银联 / Visa 等境外卡取现金，是现金补给站。'],
              ['medical_services', '医疗与保险', '日本医疗费用高，强烈建议购买含医疗的旅行保险。可通过 JNTO 医疗指南寻找支持中/英文的医院。'],
              ['hotel', '住宿与住宿税', '东京、京都、大阪等地按每人每晚征收住宿税，办理入住或退房时另付。'],
              ['translate', '语言与沟通', '大城市车站、景点普遍有中英文标识，年轻店员多能简单英语。建议备拍照 / 语音翻译 App。'],
            ].map(([icon, title, text]) => (
              <div key={title} className="bg-card rounded-2xl border hairline p-6">
                <span className="material-symbols-outlined text-pine text-2xl">{icon}</span>
                <h4 className="serif font-bold text-[16px] mt-3 mb-2">{title}</h4>
                <p className="text-[13.5px] text-ink/65 leading-7">{text}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-5 reveal show">
            <div className="lg:col-span-3 bg-card rounded-2xl border hairline p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-terracotta">record_voice_over</span>
                <h3 className="serif font-bold text-lg">常用日语速查</h3>
              </div>
              <div className="overflow-hidden rounded-xl border hairline">
                <table className="w-full text-left text-[13.5px]">
                  <thead className="bg-paper text-ink/60 text-[12px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">中文</th>
                      <th className="py-2.5 px-4 font-semibold">日语</th>
                      <th className="py-2.5 px-4 font-semibold hidden sm:table-cell">发音</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y hairline">
                    {[
                      ['谢谢', 'ありがとう', 'a-ri-ga-tou'],
                      ['不好意思 / 请问', 'すみません', 'su-mi-ma-sen'],
                      ['多少钱？', 'いくらですか？', 'i-ku-ra-de-su-ka'],
                      ['车站在哪里？', '駅はどこですか？', 'eki-wa-doko-desu-ka'],
                      ['请给我菜单', 'メニューください', 'menu-ku-da-sai'],
                      ['我想去医院', '病院に行きたい', 'byouin-ni-ikitai'],
                      ['救命！', '助けて！', 'ta-su-ke-te'],
                    ].map(([cn, jp, py]) => (
                      <tr key={cn}>
                        <td className="py-2.5 px-4">{cn}</td>
                        <td className="py-2.5 px-4 serif">{jp}</td>
                        <td className="py-2.5 px-4 text-ink/55 hidden sm:table-cell">{py}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-terracotta/5 border-l-2 border-terracotta rounded-r-2xl p-6">
                <div className="flex items-center gap-2 text-terracottaDark mb-2">
                  <span className="material-symbols-outlined">calendar_month</span>
                  <p className="font-bold">出行避峰日历</p>
                </div>
                <p className="text-[13.5px] text-ink/70 leading-7">
                  <strong>黄金周</strong>（4 月底–5 月初）、<strong>盂兰盆节</strong>（8 月中）、<strong>新年</strong>（12/29–1/3）为人潮与休业高峰。樱花（3 月底–4 月初）与红叶（11 月）为旺季，需提前数月预订。
                </p>
              </div>
              <div className="bg-pine/5 border-l-2 border-pine rounded-r-2xl p-6">
                <div className="flex items-center gap-2 text-pine mb-2">
                  <span className="material-symbols-outlined">crisis_alert</span>
                  <p className="font-bold">台风 · 地震与防灾</p>
                </div>
                <p className="text-[13.5px] text-ink/70 leading-7">
                  台风季约 <strong>7–10 月</strong>，留意航班与列车停运。地震多发，摇晃时先护头躲到坚固桌下、远离玻璃与吊物。务必安装官方 <strong>Safety tips</strong> 防灾 App（支持简体中文）。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
