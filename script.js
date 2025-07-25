// DOM 요소들
const navButtons = document.querySelectorAll('.nav-btn');
const contentSections = document.querySelectorAll('.content-section');

// 네비게이션 기능
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetSection = button.getAttribute('data-section');
        
        // 활성 버튼 변경
        navButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // 활성 섹션 변경
        contentSections.forEach(section => section.classList.remove('active'));
        document.getElementById(targetSection).classList.add('active');
        
        // 시뮬레이션 섹션이 활성화되면 캔버스 초기화
        if (targetSection === 'simulation') {
            initSimulation();
        }
        
        // 퀴즈 섹션이 활성화되면 퀴즈 초기화
        if (targetSection === 'quiz') {
            initQuiz();
        }
    });
});

// 원자 시뮬레이션 관련 변수들
let canvas, ctx;
let atoms = [];
let animationId;
let selectedElement = 'hydrogen';

// 원자 클래스
class Atom {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.element = element;
        this.radius = this.getElementRadius(element);
        this.color = this.getElementColor(element);
        this.symbol = this.getElementSymbol(element);
        this.mass = this.getElementMass(element);
    }
    
    getElementRadius(element) {
        const radii = {
            hydrogen: 15,
            helium: 20,
            carbon: 25,
            oxygen: 22,
            nitrogen: 23
        };
        return radii[element] || 20;
    }
    
    getElementColor(element) {
        const colors = {
            hydrogen: '#74b9ff',
            helium: '#a29bfe',
            carbon: '#00b894',
            oxygen: '#fd79a8',
            nitrogen: '#fdcb6e'
        };
        return colors[element] || '#74b9ff';
    }
    
    getElementSymbol(element) {
        const symbols = {
            hydrogen: 'H',
            helium: 'He',
            carbon: 'C',
            oxygen: 'O',
            nitrogen: 'N'
        };
        return symbols[element] || 'H';
    }
    
    getElementMass(element) {
        const masses = {
            hydrogen: 1,
            helium: 4,
            carbon: 12,
            oxygen: 16,
            nitrogen: 14
        };
        return masses[element] || 1;
    }
    
    update() {
        // 경계 충돌 처리
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.vx = -this.vx;
        }
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.vy = -this.vy;
        }
        
        // 위치 업데이트
        this.x += this.vx;
        this.y += this.vy;
        
        // 원자 간 충돌 처리
        atoms.forEach(atom => {
            if (atom !== this) {
                const dx = atom.x - this.x;
                const dy = atom.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.radius + atom.radius) {
                    // 탄성 충돌
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // 속도 벡터 회전
                    const vx1 = this.vx * cos + this.vy * sin;
                    const vy1 = this.vy * cos - this.vx * sin;
                    const vx2 = atom.vx * cos + atom.vy * sin;
                    const vy2 = atom.vy * cos - atom.vx * sin;
                    
                    // 충돌 후 속도 계산
                    const finalVx1 = ((this.mass - atom.mass) * vx1 + 2 * atom.mass * vx2) / (this.mass + atom.mass);
                    const finalVx2 = ((atom.mass - this.mass) * vx2 + 2 * this.mass * vx1) / (this.mass + atom.mass);
                    
                    // 속도 벡터 역회전
                    this.vx = finalVx1 * cos - vy1 * sin;
                    this.vy = vy1 * cos + finalVx1 * sin;
                    atom.vx = finalVx2 * cos - vy2 * sin;
                    atom.vy = vy2 * cos + finalVx2 * sin;
                    
                    // 겹침 방지
                    const overlap = (this.radius + atom.radius - distance) / 2;
                    const moveX = overlap * cos;
                    const moveY = overlap * sin;
                    
                    this.x -= moveX;
                    this.y -= moveY;
                    atom.x += moveX;
                    atom.y += moveY;
                }
            }
        });
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 원소 기호 그리기
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, this.x, this.y);
    }
}

// 시뮬레이션 초기화
function initSimulation() {
    canvas = document.getElementById('atom-canvas');
    ctx = canvas.getContext('2d');
    
    // 기존 애니메이션 정리
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    atoms = [];
    updateAtomCount();
    
    // 이벤트 리스너 설정
    document.getElementById('add-atom').addEventListener('click', addAtom);
    document.getElementById('clear-atoms').addEventListener('click', clearAtoms);
    document.getElementById('element-select').addEventListener('change', (e) => {
        selectedElement = e.target.value;
    });
    
    // 캔버스 클릭 이벤트
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addAtomAtPosition(x, y);
    });
    
    // 애니메이션 시작
    animate();
}

// 원자 추가
function addAtom() {
    const x = Math.random() * (canvas.width - 60) + 30;
    const y = Math.random() * (canvas.height - 60) + 30;
    addAtomAtPosition(x, y);
}

// 특정 위치에 원자 추가
function addAtomAtPosition(x, y) {
    atoms.push(new Atom(x, y, selectedElement));
    updateAtomCount();
}

// 모든 원자 제거
function clearAtoms() {
    atoms = [];
    updateAtomCount();
}

// 원자 수 업데이트
function updateAtomCount() {
    document.getElementById('atom-count').textContent = `원자 수: ${atoms.length}`;
}

// 애니메이션 루프
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    atoms.forEach(atom => {
        atom.update();
        atom.draw();
    });
    
    animationId = requestAnimationFrame(animate);
}

// =========================
// 원자 구조 시뮬레이션 (Bohr 모형)
// =========================
function drawBohrAtom(z) {
    const bohrConfig = [2, 8, 18, 32, 32, 18, 8];
    const elementNames = [
        '', '수소', '헬륨', '리튬', '베릴륨', '붕소', '탄소', '질소', '산소', '플루오린', '네온',
        '나트륨', '마그네슘', '알루미늄', '규소', '인', '황', '염소', '아르곤', '칼륨', '칼슘'
    ];
    const canvas = document.getElementById('atom-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let remain = z;
    let shells = [];
    for (let i = 0; i < bohrConfig.length; i++) {
        if (remain > 0) {
            const n = Math.min(remain, bohrConfig[i]);
            shells.push(n);
            remain -= n;
        } else {
            shells.push(0);
        }
    }
    // 원자핵
    ctx.beginPath();
    ctx.arc(200, 200, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#fdcb6e';
    ctx.fill();
    ctx.strokeStyle = '#e17055';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#2d3436';
    ctx.textAlign = 'center';
    ctx.fillText(z, 200, 205);
    // 껍질 및 전자
    for (let i = 0; i < shells.length; i++) {
        if (shells[i] === 0) continue;
        const r = 60 + i * 35;
        ctx.beginPath();
        ctx.arc(200, 200, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#74b9ff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        for (let j = 0; j < shells[i]; j++) {
            const angle = (2 * Math.PI / shells[i]) * j;
            const ex = 200 + r * Math.cos(angle);
            const ey = 200 + r * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(ex, ey, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#0984e3';
            ctx.fill();
            ctx.strokeStyle = '#636e72';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    // 정보 표시
    const name = elementNames[z] || `${z}번 원소`;
    document.getElementById('atom-info').innerHTML = `<b>${name}</b> (원자번호 ${z})<br>전자 배치: ${shells.filter(n=>n>0).join(', ')}`;
}

// =========================
// 퀴즈 기능 (전역 변수/함수)
// =========================
let quizQuestions = [
  {
    question: '원자핵을 구성하는 입자는?',
    options: ['양성자와 전자', '양성자와 중성자', '전자와 중성자', '양성자와 쿼크'],
    correct: 1
  },
  {
    question: 'Na(나트륨)의 전자 배치는?',
    options: ['2, 8, 1', '2, 6, 3', '2, 8, 2', '2, 7, 2'],
    correct: 0
  },
  {
    question: '전자수와 원자번호의 관계는?',
    options: ['항상 같다', '항상 다르다', '양성자수와 같다', '중성자수와 같다'],
    correct: 2
  }
];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;

function showQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = quizQuestions.length;
    document.getElementById('question-text').textContent = q.question;
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    q.options.forEach((option, idx) => {
        const div = document.createElement('div');
        div.className = 'quiz-option';
        div.textContent = option;
        div.onclick = function() { selectAnswer(idx); };
        optionsContainer.appendChild(div);
    });
    selectedAnswer = null;
    document.getElementById('submit-answer').disabled = true;
    document.getElementById('submit-answer').style.display = 'inline-block';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
}

function selectAnswer(idx) {
    selectedAnswer = idx;
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.quiz-option')[idx].classList.add('selected');
    document.getElementById('submit-answer').disabled = false;
}

function submitAnswer() {
    if (selectedAnswer === null) return;
    const q = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === q.correct;
    if (isCorrect) score++;
    const result = document.getElementById('quiz-result');
    result.style.display = 'block';
    result.className = isCorrect ? 'result-correct' : 'result-incorrect';
    result.textContent = isCorrect ? '정답입니다! 🎉' : `틀렸습니다. 정답: ${q.options[q.correct]}`;
    document.getElementById('submit-answer').style.display = 'none';
    document.getElementById('next-question').style.display = 'inline-block';
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    const quizContainer = document.querySelector('.quiz-container');
    const percent = Math.round((score / quizQuestions.length) * 100);
    quizContainer.innerHTML = `
        <h2>퀴즈 완료!</h2>
        <div class="quiz-result-final">
            <h3>점수: ${score}/${quizQuestions.length} (${percent}%)</h3>
            <p>${percent >= 80 ? '훌륭합니다! 원자 구조를 잘 이해하고 있습니다.' : percent >= 60 ? '좋아요! 조금 더 복습해보세요.' : '기본 개념을 다시 복습해보세요.'}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 30px; background: linear-gradient(145deg, #74b9ff, #a29bfe); color: white; border: none; border-radius: 25px; cursor: pointer;">다시 시작</button>
        </div>
    `;
}

// 이벤트 리스너 설정
function enhanceAtomVisuals() {
    const atomVisuals = document.querySelectorAll('.atom-visual');
    
    atomVisuals.forEach(visual => {
        visual.addEventListener('mouseenter', () => {
            visual.style.transform = 'scale(1.1)';
        });
        
        visual.addEventListener('mouseleave', () => {
            visual.style.transform = 'scale(1)';
        });
    });
}

// 페이지 로드 완료 후 실행
window.addEventListener('load', () => {
    enhanceAtomVisuals();
}); 

// =========================
// DOMContentLoaded: 이벤트 연결 및 초기화
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetSection).classList.add('active');
            // 시뮬레이션 탭이 활성화될 때마다 원자 구조 다시 그리기
            if (targetSection === 'simulation') {
                const z = parseInt(document.getElementById('atomic-number').value);
                drawBohrAtom(z);
            }
            // 퀴즈 탭이 활성화될 때마다 퀴즈 초기화
            if (targetSection === 'quiz') {
                currentQuestionIndex = 0;
                score = 0;
                showQuestion();
            }
        });
    });

    // 시뮬레이션: 원자 구조 그리기 버튼
    document.getElementById('draw-atom').addEventListener('click', () => {
        const z = parseInt(document.getElementById('atomic-number').value);
        drawBohrAtom(z);
    });
    // 최초 1번 그리기
    drawBohrAtom(1);

    // 퀴즈 이벤트 연결
    document.getElementById('submit-answer').addEventListener('click', submitAnswer);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    showQuestion();
}); 