document.addEventListener('DOMContentLoaded', () => {

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            if (mobileMenu.classList.contains('hidden') === false) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    const timelineData = [
        {
            scientist: '돌턴',
            year: '1803',
            title: '단단한 공 모형',
            description: "원자는 더 이상 쪼개지지 않는 단단한 공과 같다. 같은 원소의 원자는 모두 같고 다른 원소의 원자는 다르다.",
            analogy: "마치 레고 블록 같아요!",
            modelImage: 'dalton.png',
            side: 'left'
        },
        {
            scientist: '톰슨',
            year: '1897',
            title: '건포도 빵 모형',
            description: "음극선 실험을 통해 (-)전하를 띤 '전자'를 발견했다. 원자는 (+)전하를 띤 덩어리에 전자가 박혀있는 모습이다.",
            analogy: "마치 건포도가 박힌 빵 같아요!",
            modelImage: 'thomson.png',
            side: 'right'
        },
        {
            scientist: '러더퍼드',
            year: '1911',
            title: '행성 모형 (원자핵 발견)',
            description: "알파 입자 산란 실험을 통해 원자 중심에 작고 무거운 '원자핵'이 있다는 것을 발견했다. 원자는 원자핵 주위를 전자가 도는 모습이다.",
            analogy: "마치 태양계 같아요!",
            modelImage: 'rutherford.png',
            side: 'left'
        },
        {
            scientist: '보어',
            year: '1913',
            title: '궤도 모형',
            description: "전자는 정해진 에너지 궤도(전자 껍질)에만 존재할 수 있다고 설명했다. 이는 원자의 안정성과 선 스펙트럼을 설명했다.",
            analogy: "마치 정해진 층만 다니는 계단 같아요!",
            modelImage: 'bohr.png',
            side: 'right'
        }
    ];

    const timelineContainer = document.getElementById('timeline-container');
    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        const isLeft = index % 2 === 0;
        // Adjusted classes for better alignment with the central line
        timelineItem.className = `timeline-item md:max-w-md bg-white p-6 rounded-lg border-2 border-transparent shadow-md ${isLeft ? 'md:ml-auto md:mr-[calc(50%+20px)] md:text-right' : 'md:mr-auto md:ml-[calc(50%+20px)] md:text-left'} relative`;
        timelineItem.innerHTML = `
            <p class="text-sm font-semibold text-blue-600">${item.year}</p>
            <h3 class="text-xl font-bold mt-1 text-gray-800">${item.scientist} - ${item.title}</h3>
            <p class="text-gray-600 mt-2">${item.description}</p>
            <p class="text-blue-700 font-medium italic mt-3">"${item.analogy}"</p>
        `;
        timelineItem.addEventListener('click', () => {
            document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
            timelineItem.classList.add('active');
        });
        timelineContainer.appendChild(timelineItem);
    });

    const particleData = {
        nucleus: {
            title: '원자핵 (Nucleus)',
            description: `<p>원자의 중심에 위치하며 <strong>양성자</strong>와 <strong>중성자</strong>로 이루어져 있습니다. 원자 질량의 대부분을 차지하며 (+)전하를 띱니다.</p>
                <ul class="list-disc list-inside mt-4 space-y-2">
                  <li><strong>양성자 (Proton):</strong> (+)전하를 띠며, 양성자의 수가 원소의 종류를 결정합니다 (원자 번호). 상대적 질량은 약 1입니다.</li>
                  <li><strong>중성자 (Neutron):</strong> 전하를 띠지 않으며, 양성자와 함께 원자핵을 구성합니다. 양성자와 질량이 거의 같습니다.</li>
                </ul>`
        },
        electron: {
            title: '전자 (Electron)',
            description: `<p>원자핵 주위의 특정 에너지 궤도(전자 껍질)를 따라 움직이는 입자입니다. (-)전하를 띠며 질량은 양성자나 중성자에 비해 매우 작습니다 (약 1/1837).</p>
                <ul class="list-disc list-inside mt-4 space-y-2">
                  <li><strong>전기적 중성:</strong> 중성 원자에서는 (+)전하를 띤 양성자의 수와 (-)전하를 띤 전자의 수가 같아 전체적으로 전기적 중성을 이룹니다.</li>
                  <li><strong>에너지 준위:</strong> 전자는 정해진 에너지 궤도에만 존재할 수 있으며, 궤도를 이동할 때 에너지를 흡수하거나 방출합니다.</li>
                </ul>`
        }
    };
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    
    document.getElementById('nucleus-hotspot').addEventListener('click', () => {
        infoTitle.textContent = particleData.nucleus.title;
        infoDescription.innerHTML = particleData.nucleus.description;
    });

    document.getElementById('electron-hotspot').addEventListener('click', () => {
        infoTitle.textContent = particleData.electron.title;
        infoDescription.innerHTML = particleData.electron.description;
    });

    const atomState = {
        protons: 1,
        neutrons: 0,
        electrons: 1
    };

    const elements = {
        1: { name: '수소', symbol: 'H', standardNeutrons: 0 },
        2: { name: '헬륨', symbol: 'He', standardNeutrons: 2 },
        3: { name: '리튬', symbol: 'Li', standardNeutrons: 4 },
        4: { name: '베릴륨', symbol: 'Be', standardNeutrons: 5 },
        5: { name: '붕소', symbol: 'B', standardNeutrons: 6 },
        6: { name: '탄소', symbol: 'C', standardNeutrons: 6 },
        7: { name: '질소', symbol: 'N', standardNeutrons: 7 },
        8: { name: '산소', symbol: 'O', standardNeutrons: 8 },
        9: { name: '플루오린', symbol: 'F', standardNeutrons: 10 },
        10: { name: '네온', symbol: 'Ne', standardNeutrons: 10 },
    };

    const protonsCountEl = document.getElementById('protons-count');
    const neutronsCountEl = document.getElementById('neutrons-count');
    const electronsCountEl = document.getElementById('electrons-count');
    const elementNameEl = document.getElementById('element-name');
    const atomicNumberEl = document.getElementById('atomic-number');
    const massNumberEl = document.getElementById('mass-number');
    const chargeEl = document.getElementById('charge');
    const isotopeInfoEl = document.getElementById('isotope-info');
    const canvas = document.getElementById('atomCanvas');
    const ctx = canvas.getContext('2d');

    function updateUI() {
        protonsCountEl.textContent = atomState.protons;
        neutronsCountEl.textContent = atomState.neutrons;
        electronsCountEl.textContent = atomState.electrons;
        
        const element = elements[atomState.protons] || { name: '알 수 없음', symbol: '?', standardNeutrons: -1 };
        elementNameEl.textContent = `${element.name} (${element.symbol})`;
        atomicNumberEl.textContent = atomState.protons;
        massNumberEl.textContent = atomState.protons + atomState.neutrons;
        
        const charge = atomState.protons - atomState.electrons;
        chargeEl.textContent = charge > 0 ? `+${charge}` : charge;
        
        if (element.standardNeutrons !== -1 && atomState.neutrons !== element.standardNeutrons) {
            isotopeInfoEl.textContent = `${element.name}의 동위 원소입니다.`;
        } else {
            isotopeInfoEl.textContent = '';
        }

        drawAtom();
    }

    document.querySelectorAll('.control-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const particle = e.currentTarget.dataset.particle;
            const action = e.currentTarget.dataset.action;
            if (action === 'increase') {
                if (atomState[particle] < (particle === 'protons' ? 10 : 20)) atomState[particle]++;
            } else if (action === 'decrease') {
                if (atomState[particle] > (particle === 'protons' ? 1 : 0)) atomState[particle]--;
            }
            if (particle === 'protons') {
               atomState.electrons = atomState.protons; // Keep electrons equal to protons for neutral atom on proton change
            }
            updateUI();
        });
    });

    function drawAtom() {
        const { protons, neutrons, electrons } = atomState;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nucleusRadius = Math.min(60, 10 + (protons + neutrons) * 1.5);
        ctx.beginPath();
        ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(254, 202, 202, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.stroke();

        drawParticles(protons, centerX, centerY, nucleusRadius * 0.7, '#ef4444');
        drawParticles(neutrons, centerX, centerY, nucleusRadius * 0.7, '#6b7280', protons);

        const electronShells = [80, 120, 160];
        let electronsToPlace = electrons;

        electronShells.forEach((radius, index) => {
            const shellCapacity = (index + 1) * 2 + 6;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const electronsInShell = Math.min(electronsToPlace, shellCapacity);
            for (let i = 0; i < electronsInShell; i++) {
                const angle = (2 * Math.PI / electronsInShell) * i + (Date.now() / 1000);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = '#3b82f6';
                ctx.fill();
            }
            electronsToPlace -= electronsInShell;
        });
    }
    
    function drawParticles(count, cx, cy, maxRadius, color, offset = 0) {
         for (let i = 0; i < count; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = Math.random() * maxRadius;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
    
    function animate() {
        drawAtom();
        requestAnimationFrame(animate);
    }

    updateUI();
    animate();
});