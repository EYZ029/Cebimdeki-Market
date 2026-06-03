// Sepeti açan/kapayan fonksiyon
function toggleCart() {
    const cartPanel = document.querySelector('.right-cart-panel');
    cartPanel.classList.toggle('active');
}

// Kapatma butonuna (✕) tıklayınca da kapansın
document.querySelector('.cart-close-btn').addEventListener('click', toggleCart);

function sepeteEkleSecili(isim, bim, a101, sok, selectId) {
    let select = document.getElementById(selectId);
    let degerler = select.value.split('|');
    let market = degerler[0];
    let fiyat = parseFloat(degerler[1]);
    
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    
    let mevcutUrun = sepet.find(item => item.isim === isim && item.market === market);
    
    if (mevcutUrun) {
        mevcutUrun.miktar += 1;
    } else {
        sepet.push({ 
            isim: isim, 
            market: market, 
            fiyat: fiyat, 
            miktar: 1,
            bim: parseFloat(bim), 
            a101: parseFloat(a101), 
            sok: parseFloat(sok) 
        });
    }
    
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    alert(isim + " (" + market + ") sepete eklendi!");
}

// Sayfa açıldığında sepeti yükle
document.addEventListener('DOMContentLoaded', sepetiGuncelle);

// Sepeti açıp kapatan fonksiyon
function toggleCart() {
    const sepetPanel = document.querySelector('.right-cart-panel');
    sepetPanel.classList.toggle('active');
}

// 1. Market Seçimi: Tıklanan kutuyu yeşil yap ve kartın içine hangi marketin seçili olduğunu kaydet
function marketSec(element, marketAdi) {
    let parent = element.parentElement;
    parent.querySelectorAll('.store-col').forEach(el => el.classList.remove('secili'));
    element.classList.add('secili');
    element.closest('.product-card-unit').dataset.seciliMarket = marketAdi;
}

// Sayfa yüklendiğinde her kart için en ucuz marketi otomatik seçen fonksiyon
function otomatikEnUcuzuSec() {
    const urunler = document.querySelectorAll('.product-card-unit');
    
    urunler.forEach(urun => {
        // Kartın içindeki market sütunlarını bul
        const marketler = urun.querySelectorAll('.store-col');
        let enUcuzFiyat = Infinity;
        let enUcuzEleman = null;
        let enUcuzMarketAdi = "";

        marketler.forEach(market => {
            // Fiyat metnini al (Örn: "34.50 TL" -> 34.5)
            const fiyatText = market.querySelector('.store-price').innerText;
            const fiyat = parseFloat(fiyatText.replace(' TL', '').replace(',', '.'));
            
            // Market ismini al
            const marketAdi = market.querySelector('.store-label').innerText.trim();

            // Eğer fiyat 0'dan büyükse ve şu ana kadarki en düşük fiyatsa güncelle
            if (fiyat > 0 && fiyat < enUcuzFiyat) {
                enUcuzFiyat = fiyat;
                enUcuzEleman = market;
                enUcuzMarketAdi = marketAdi;
            }
        });

        // En ucuz marketi bulduysak, onu seçili yap
        if (enUcuzEleman) {
            // Diğer tüm seçilileri kaldır
            marketler.forEach(el => el.classList.remove('secili'));
            // En ucuzu seçili yap
            enUcuzEleman.classList.add('secili');
            // Kartın datasetine kaydet
            urun.dataset.seciliMarket = enUcuzMarketAdi;
        }
    });
}

// 2. Sepete Ekle (Sessiz ve Market Seçimli)
function sepeteEkle(button, isim, resim, fiyatBim, fiyatA101, fiyatSok) {
    let card = button.closest('.product-card-unit');
    let seciliSutun = card.querySelector('.store-col.secili');
    
    if (!seciliSutun) {
        alert("Lütfen bir market seçiniz!");
        return;
    }

    let market = seciliSutun.querySelector('.store-label').innerText.trim();
    
    // Fiyatları sayıya çeviriyoruz (Virgül varsa noktaya çevirerek)
    let b = parseFloat(fiyatBim) || 0;
    let a = parseFloat(fiyatA101) || 0;
    let s = parseFloat(fiyatSok) || 0;

    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let urunKey = isim + "-" + market;
    let varMi = sepet.find(item => item.key === urunKey);
    
    if (varMi) {
        varMi.adet += 1;
    } else {
        // BURASI ÇOK ÖNEMLİ: Tüm fiyatları kaydediyoruz ki karşılaştırma çalışsın
        sepet.push({ 
            key: urunKey, 
            isim: isim, 
            resim: resim, 
            market: market,
            adet: 1,
            bim: b, 
            a101: a, 
            sok: s,
            fiyat: (market === 'BİM' ? b : (market === 'A101' ? a : s)) 
        });
    }
    
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiGuncelle();
}

// 3. Sepeti Güncelle (HTML'e yansıt)
function sepetiGuncelle() {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    let liste = document.querySelector('.cart-item-list');
    let toplamAltSpan = document.querySelector('.total-row-cart span:last-child'); 
    
    if (!liste) return;
    
    liste.innerHTML = ""; 
    let genelToplam = 0;
    let toplamAdet = 0;
    
    sepet.forEach((urun, index) => {
        let urunToplam = (urun.fiyat * urun.adet);
        genelToplam += urunToplam;
        toplamAdet += urun.adet;

        liste.innerHTML += `
            <div class="cart-item-box">
                <img src="${urun.resim}" alt="${urun.isim}" style="width:40px;">
                <div class="cart-item-details">
                    <p style="margin:0; font-weight:bold;">${urun.isim}</p>
                    <small>Market: <b>${urun.market}</b></small>
                    <div style="font-size:0.9rem;">${urun.fiyat.toFixed(2)} TL x ${urun.adet}</div>
                    <div class="item-total" style="font-size:0.8rem; color:#3e8e41;">Adet Toplamı: ${(urun.fiyat * urun.adet).toFixed(2)} TL</div>
                    <button onclick="adetiDegistir(${index}, -1)">-</button>
                    <span style="margin:0 8px;">${urun.adet}</span>
                    <button onclick="adetiDegistir(${index}, 1)">+</button>
                    <button onclick="urunuSil(${index})" style="color:red; margin-left:10px;">Sil</button>
                </div>
            </div>
        `;
    });
    
    if (toplamAltSpan) {
        toplamAltSpan.innerText = genelToplam.toFixed(2) + " TL";
    }
    
    // --- GÜNCEL KISIM BURASI ---
    let sepetButonu = document.querySelector('.cart-trigger-btn');
    if (sepetButonu) {
        // Eğer adet 0'dan büyükse badge'i ekle, değilse sadece metni/ikonu bırak
        let badgeHtml = toplamAdet > 0 ? `<span class="cart-count-badge">(${toplamAdet})</span>` : "";
        sepetButonu.innerHTML = `🛒 Sepetim ${badgeHtml}`;
    }
}

// 4. Adet Değiştir
function adetiDegistir(index, artis) {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    sepet[index].adet += artis;
    if (sepet[index].adet <= 0) sepet.splice(index, 1);
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiGuncelle();
}

// 5. Sil
function urunuSil(index) {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    sepet.splice(index, 1);
    localStorage.setItem('sepetim', JSON.stringify(sepet));
    sepetiGuncelle();
}

// 6. Sepet Paneli Aç/Kapa
function toggleCart() {
    document.querySelector('.right-cart-panel').classList.toggle('active');
}

function filtrele(marketSecimi) {
    if (marketSecimi === 'Tümü') {
        document.querySelectorAll('.store-col').forEach(col => col.style.display = "flex");
        return;
    }

    document.querySelectorAll('.product-card-unit').forEach(kart => {
        let hedefSutun = null;
        
        kart.querySelectorAll('.store-col').forEach(col => {
            let label = col.querySelector('.store-label').innerText.trim().toUpperCase();
            if (label === marketSecimi.toUpperCase()) {
                col.style.display = "flex";
                hedefSutun = col; // Seçilen market sütununu bulduk
            } else {
                col.style.display = "none";
            }
        });

        // KRİTİK NOKTA: Filtreleme yapıldığında o marketi otomatik "secili" yap
        if (hedefSutun) {
            kart.querySelectorAll('.store-col').forEach(el => el.classList.remove('secili'));
            hedefSutun.classList.add('secili');
        }
    });
}

// 7. YENİ: Kategori Filtreleme (Yan Menü)
function kategoriFiltrele(kategoriAdi) {
    // Sayfadaki tüm ürün kartlarını seçiyoruz
    const urunler = document.querySelectorAll('.product-card-unit');
    
    urunler.forEach(urun => {
        // Her ürünün data-kategori özelliğini alıyoruz
        const urunKategorisi = urun.getAttribute('data-kategori');
        
        // Eğer 'hepsi' seçildiyse veya ürünün kategorisi seçilenle aynıysa göster
        if (kategoriAdi === 'hepsi' || urunKategorisi === kategoriAdi) {
            urun.style.display = 'flex'; // Görünür yap
        } else {
            urun.style.display = 'none'; // Gizle
        }
    });
}

// 8. 'Ürünleri Karşılaştır' fonksiyon
function karsilastirmayiBaslat() {
    let sepet = JSON.parse(localStorage.getItem('sepetim')) || [];
    
    let eski = document.getElementById('compare-modal');
    if(eski) eski.remove();

    if (sepet.length === 0) {
        let hataHtml = `
            <div id="compare-modal" class="compare-modal">
                <div class="compare-modal-content" style="border-top: 5px solid #ff4d4d; text-align:center; border-radius:12px;">
                    <h3 style="color: #ff4d4d;">Liste Boş! ⚠️</h3>
                    <p>Karşılaştırma yapabilmek için önce Sepetinize ürün eklemelisiniz.</p>
                    <button onclick="this.parentElement.parentElement.remove()" class="compare-products-btn" style="background-color: #ff4d4d; margin-top: 15px; border-radius:6px;">Tamam</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', hataHtml);
        return;
    }

    // --- ÖZEL TASARIM STİLLERİ (Scrollbar ve Sabit Header) ---
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
        /* Yeşil temalı özel kaydırma çubuğu */
        .compare-scroll-area::-webkit-scrollbar { width: 8px; }
        .compare-scroll-area::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .compare-scroll-area::-webkit-scrollbar-thumb { background: #3e8e41; border-radius: 10px; }
        .compare-scroll-area::-webkit-scrollbar-thumb:hover { background: #2d6a30; }

        /* Navbar'ın sabit kalması için */
        .sticky-header th {
            position: sticky;
            top: 0;
            background: #f8f8f8 !important;
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border-bottom: 2px solid #3e8e41;
            color: #3e8e41;
            padding: 15px;
            font-size: 0.9rem;
        }

        .product-info-cell {
            display: grid;
            grid-template-columns: 50px 1fr;
            align-items: center;
            gap: 12px;
            padding: 12px;
        }
    `;
    document.head.appendChild(styleTag);

    let bimTop = 0, a101Top = 0, sokTop = 0;
    let urunSatirlari = "";

    sepet.forEach(urun => {
        bimTop += (urun.bim || 0) * urun.adet;
        a101Top += (urun.a101 || 0) * urun.adet;
        sokTop += (urun.sok || 0) * urun.adet;
        
        urunSatirlari += `
            <tr style="border-bottom: 1px solid #eee;">
                <td class="product-info-cell" style="width: 50%;">
                    <img src="${urun.resim}" 
                         style="width: 45px; height: 45px; object-fit: contain; border-radius: 6px; border: 1px solid #eee; background: white;">
                    <div style="display: flex; flex-direction: column; line-height: 1.4;">
                        <span style="font-size: 0.85rem; font-weight: 700; color: #333;">${urun.isim}</span>
                        <div style="display: flex; gap: 10px; align-items: center; margin-top: 2px;">
                            <span style="font-size: 0.75rem; color: #666; background: #f0f0f0; padding: 1px 6px; border-radius: 4px;">
                                ${urun.adet} Adet
                            </span>
                            <span style="font-size: 0.75rem; color: #3e8e41; font-weight: 600;">🏪 ${urun.market}</span>
                        </div>
                    </div>
                </td>
                <td style="width: 16.6%; text-align: center; padding: 10px;">
                    <div style="font-weight: 700; font-size: 0.9rem;">${((urun.bim || 0) * urun.adet).toFixed(2)} TL</div>
                    <div style="font-size: 0.7rem; color: #888;">${(urun.bim || 0).toFixed(2)} TL/Adet</div>
                </td>
                <td style="width: 16.6%; text-align: center; padding: 10px;">
                    <div style="font-weight: 700; font-size: 0.9rem;">${((urun.a101 || 0) * urun.adet).toFixed(2)} TL</div>
                    <div style="font-size: 0.7rem; color: #888;">${(urun.a101 || 0).toFixed(2)} TL/Adet</div>
                </td>
                <td style="width: 16.6%; text-align: center; padding: 10px;">
                    <div style="font-weight: 700; font-size: 0.9rem;">${((urun.sok || 0) * urun.adet).toFixed(2)} TL</div>
                    <div style="font-size: 0.7rem; color: #888;">${(urun.sok || 0).toFixed(2)} TL/Adet</div>
                </td>
            </tr>
        `;
    });

    let fiyatlar = [bimTop, a101Top, sokTop].filter(f => f > 0);
    let enUcuzGenel = Math.min(...fiyatlar);

    let modalHtml = `
        <div id="compare-modal" class="compare-modal" style="backdrop-filter: blur(4px);">
            <div class="compare-modal-content" style="max-width: 800px; width: 95%; padding: 25px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                <span class="close-compare" style="top: 15px; right: 20px; font-size: 28px; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px; color: #2c3e50;">
                    <span style="background: #3e8e41; color: white; padding: 5px 10px; border-radius: 8px; font-size: 1rem;">📊</span> 
                    Fiyat Karşılaştırma Analizi
                </h3>
                
                <div class="compare-scroll-area" style="max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 10px;">
                    <table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
                        <thead class="sticky-header">
                            <tr>
                                <th style="width: 50%; text-align: left;">Ürün Bilgisi</th>
                                <th style="width: 16.6%; text-align: center;">BİM</th>
                                <th style="width: 16.6%; text-align: center;">A101</th>
                                <th style="width: 16.6%; text-align: center;">ŞOK</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${urunSatirlari}
                        </tbody>
                    </table>
                </div>

                <div style="background:#f1f8f1; border: 2px solid #3e8e41; margin-top: 20px; border-radius: 10px; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                        <tr style="font-weight:bold; font-size: 1rem;">
                            <td style="width: 50%; padding: 18px; color: #2c3e50;">GENEL SEPET TOPLAMI</td>
                            <td style="width: 16.6%; text-align: center; padding: 18px;" class="${bimTop === enUcuzGenel ? 'best-option' : ''}">${bimTop.toFixed(2)} TL</td>
                            <td style="width: 16.6%; text-align: center; padding: 18px;" class="${a101Top === enUcuzGenel ? 'best-option' : ''}">${a101Top.toFixed(2)} TL</td>
                            <td style="width: 16.6%; text-align: center; padding: 18px;" class="${sokTop === enUcuzGenel ? 'best-option' : ''}">${sokTop.toFixed(2)} TL</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 9. Mobilde Kategorileri Açıp Kapatan Ekstra Kod
document.addEventListener('DOMContentLoaded', function() {
    const categoryHeader = document.querySelector('.sidebar-categories h3');
    const sidebar = document.querySelector('.sidebar-categories');

    if (categoryHeader) {
        categoryHeader.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            }
        });
    }
});

function closeCompareModal() {
    document.getElementById('compare-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    otomatikEnUcuzuSec(); // Önce en ucuzları belirle
    sepetiGuncelle();     // Sonra sepeti yükle
});