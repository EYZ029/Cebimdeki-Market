# 🛒 Cebimdeki Market - Akıllı Alışveriş Platformu

![Python](https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-Web_Framework-lightgrey?style=flat-square&logo=flask)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?style=flat-square&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue?style=flat-square&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=flat-square&logo=javascript)

**Cebimdeki Market**, BİM, A101 ve ŞOK indirim marketlerindeki ürün fiyatlarını merkezi bir yapıda birleştirerek tüketicilerin en uygun fiyatlı sepet optimizasyonunu yapmasını sağlayan dinamik bir Flask tabanlı web uygulamasıdır. 

> *Bu proje, Alanya Üniversitesi - BPR 216 Bilgisayar Programlama Yazılım Geliştirme Dersi kapsamında **Efe Yılmaz** (Öğrenci No: 240053023) tarafından geliştirilmiştir.*

---

## I. Öne Çıkan Teknik Özellikler ve Kod Mimarisi

- **🔍 Akıllı Arama & Filtreleme Mantığı (Backend):** `app.py` üzerinde geliştirilen arama mimarisi sayesinde, kullanıcıdan gelen sorgular `urunler.json` veritabanındaki ürün isimleriyle eşleştirilir. Arama terimi boşsa tüm liste yüklenir. Eğer eşleşen ürün bulunamazsa, `index.html` içerisindeki Jinja2 döngüsü otomatik olarak *"Üzgünüz, Aradığınız Ürün Bulunamadı"* ekranını dinamik olarak tetikler.
- **🛒 Tarayıcı Tabanlı Akıllı Sepet (Client-Side):** Üyelik veya harici bir veritabanı gerektirmeksizin, kullanıcının seçtiği markete özel ürün fiyatı, miktarı ve diğer market alternatifleri tarayıcının `LocalStorage` belleğinde JSON formatında güvenli bir şekilde saklanır.
- **📊 Gelişmiş Sepet Karşılaştırma Matrisi:** `script.js` içindeki `karsilastirmayiBaslat()` fonksiyonu, kullanıcının sepetindeki ürünleri tek tek analiz eder. Her ürünün BİM, A101 ve ŞOK fiyatlarını miktarlarıyla çarparak 3 farklı senaryo için **"Matris Toplamı"** çıkartır.
- **💡 En Ucuz Market Optimizasyonu:** Algoritma, hesaplanan toplamlar arasından en düşük olanı bulur ve dinamik olarak oluşturulan karşılaştırma tablosunda en ucuz marketi yeşil arka plan (`best-option` sınıfı) ile etiketleyerek kullanıcıya sunar.
- **📱 Responsive ve Katlanabilir Mimari:** `styles.css` içinde özel olarak kurgulanan CSS Grid, Flexbox yapısı ve `@media` kırılma noktaları sayesinde, yan menüdeki kategoriler mobilde katlanabilir (`active` sınıfı tetiklemeli) hale getirilmiştir.

---

## II. Mimari Bağlantılar ve Projenin Güçlü Noktaları

Uygulamanın bileşenleri birbirine sıkı sıkıya bağlı ve senkronize bir hiyerarşide çalışmaktadır:

1. **Veri Katmanı (`urunler.json`):** Her ürün için benzersiz bir `id`, `isim`, `kategori`, `resim` url'i ve 3 marketin fiyat bilgisini (`bim`, `a101`, `sok`) içeren yapılandırılmış bir veri modelidir.
2. **Sunucu Entegrasyonu (`app.py`):** Flask `request.args.get('q')` yöntemiyle istemciden gelen arama sorgularını yakalar, filtreler ve `render_template` yöntemiyle ana arayüze paslar.
3. **Dinamik Döngüler (`index.html`):** Jinja2 şablon motoruyla backend'den gelen ürünleri `{% for urun in urunler %}` döngüsüyle ekrana basar. Arama sonucu boş kalırsa devreye giren `{% else %}` kontrol bloğu sayesinde kullanıcı deneyimini kusursuzlaştırır. Sağ tarafta kayarak açılan dinamik bir sepet paneline (`right-cart-panel`) sahiptir.
4. **Dosya Yolu Senkronizasyonu:** Dosya hiyerarşisi, Flask standartlarına ve `../static/styles.css` gibi temiz bir statik varlık yönlendirmesine uygun olarak tasarlanmıştır, kırık link barındırmaz.

---

## III. Proje Dizin Yapısı

Projenin kaynak kodları, şablonları ve statik varlıkları aşağıdaki hiyerarşik dosya yollarına göre birbirine bağlanmıştır:

```text
cebimdeki_market/
│
├── app.py                      # Flask ana sunucu kodu ve Python tabanlı arama yönlendirmeleri
├── urunler.json                # 70+ ürünü ve 3 farklı market fiyatını tutan JSON veri tabanı
│
├── static/                     # Statik Varlıklar (CSS, JS, Görseller)
│   ├── styles.css              # Custom CSS Değişkenleri, Flexbox/Grid ve Mobil Uyum (Responsive) tasarımları
│   ├── script.js               # LocalStorage yönetimi, sepet render süreçleri ve karşılaştırma algoritması
│   └── images/
│       └── logo.png            # Sitenin ana kurumsal kimlik logosu
│
└── templates/                  # HTML Arayüz Şablonları (Jinja2)
    └── index.html              # Anasayfa, Arama Kutusu, Dinamik Ürün Kartları ve Sağ Sepet Paneli

---

## **IV. 📅 Gelecek Çalışmalar ve Yol Haritası (Faz-2)**

Projenin temel MVP mimarisi kararlı çalışmaktadır. Bir sonraki aşamada şu özelliklerin eklenmesi planlanmaktadır:

* **Fiyat Değişim Grafikleri:** Ürünlerin son 1 aydaki fiyat dalgalanmalarını, indirim trendlerini kullanıcılara gösterebilmek amacıyla Chart.js kütüphanesi tabanlı veri görselleştirme paneli (Altyapısı HTML'de hazır bırakılmıştır).
* **Otomatik Veri Çekme (Web Scraping Modülü):** Python Playwright veya BeautifulSoup kütüphaneleri kullanılarak marketlerin resmi web sitelerinden/API'lerinden anlık gerçek fiyat verilerini çekecek botların sisteme entegre edilmesi.

---

## **V. 💻 Kurulum ve Lokal Çalıştırma Adımları**

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayınız:

**Bağımlılıkları yükleyin:**

```bash
pip install flask

**Uygulamayı başlatın:**

```bash
python app.py

Tarayıcınızdan http://127.0.0.1:5000 adresine giderek platformu test edebilirsiniz.

---
