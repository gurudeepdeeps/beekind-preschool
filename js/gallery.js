
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const counter = document.getElementById('imageCounter');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('prevImg');
    const nextBtn = document.getElementById('nextImg');
    const thumbStrip = document.getElementById('thumbStrip');

    let currentAlbum = [];
    let currentIndex = 0;
    let currentAlbumTitle = '';

    // Album Data Mapping
    // In a real app, this would come from a CMS or structured JSON
    const albumData = {
        'independence-day': [
            'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1200&q=80',
            'https://images.unsplash.com/photo-1599427303058-f04cbcf47a61?w=1200&q=80',
            'https://images.unsplash.com/photo-1589182397057-b82d91139d5a?w=1200&q=80'
        ],
        'krishnajanmashtami': [
            'assets/images/gallery/krishna_janmashtami_2025.png',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80',
            'https://images.unsplash.com/photo-1590059515050-8b14a8497fae?w=1200&q=80'
        ],
        'yellow-day': [
            'assets/images/gallery/yellow_day_2025.png',
            'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1200&q=80',
            'https://images.unsplash.com/photo-1597116812841-f6733221975e?w=1200&q=80'
        ],
        'raksha-bandhan': [
            'assets/images/gallery/raksha_bandhan_2025.png',
            'https://images.unsplash.com/photo-1560421683-6856358d27ee?w=1200&q=80',
            'https://images.unsplash.com/photo-1550523098-958f0012f275?w=1200&q=80'
        ],
        // Default / Placeholder for others
        'default': [
            'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80',
            'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80',
            'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&q=80'
        ]
    };

    // Filtering Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // Opening Lightbox
    const openAlbum = (albumId, title) => {
        currentAlbumTitle = title;
        
        // Find which key to use in albumData
        let key = 'default';
        for (let k in albumData) {
            if (albumId.includes(k)) {
                key = k;
                break;
            }
        }
        
        currentAlbum = albumData[key];
        currentIndex = 0;
        
        updateModal();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Create thumbnails
        thumbStrip.innerHTML = '';
        currentAlbum.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'thumb' + (idx === 0 ? ' active' : '');
            img.onclick = () => { currentIndex = idx; updateModal(); };
            thumbStrip.appendChild(img);
        });
    };

    const updateModal = () => {
        modalImg.classList.remove('active');
        setTimeout(() => {
            modalImg.src = currentAlbum[currentIndex];
            modalTitle.innerText = currentAlbumTitle;
            counter.innerText = `Image ${currentIndex + 1} of ${currentAlbum.length}`;
            modalImg.classList.add('active');
            
            // Update thumbnails
            const thumbs = thumbStrip.querySelectorAll('.thumb');
            thumbs.forEach((t, i) => {
                if (i === currentIndex) t.classList.add('active');
                else t.classList.remove('active');
            });
        }, 100);
    };

    // Navigation
    nextBtn.onclick = () => {
        currentIndex = (currentIndex + 1) % currentAlbum.length;
        updateModal();
    };

    prevBtn.onclick = () => {
        currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
        updateModal();
    };

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) closeBtn.onclick();
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'ArrowRight') nextBtn.onclick();
            if (e.key === 'ArrowLeft') prevBtn.onclick();
            if (e.key === 'Escape') closeBtn.onclick();
        }
    });

    // Attach click events to gallery items
    const albumLinks = document.querySelectorAll('.main-gal-page a, .main-gal-page h4 a');
    albumLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const parent = link.closest('.main-gal-page');
            const title = parent.querySelector('h4').innerText;
            const albumId = link.getAttribute('href');
            openAlbum(albumId, title);
        };
    });
    
    // Add overlay to all items dynamically if not present
    document.querySelectorAll('.mg-img').forEach(imgContainer => {
        if (!imgContainer.querySelector('.album-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'album-overlay';
            overlay.innerHTML = '<div class="view-btn"><i class="fas fa-eye"></i></div>';
            imgContainer.appendChild(overlay);
        }
    });
});
