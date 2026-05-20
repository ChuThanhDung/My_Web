import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Layers, Target, Activity, Code, ListChecks } from 'lucide-react';

export default function SVMContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Section = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 text-purple-600 dark:text-purple-400 border-b border-slate-200 dark:border-slate-700 pb-3">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="p-5 my-6 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-r-xl shadow-sm">
      {children}
    </div>
  );

  const codeLinear = `from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

# Linear SVM
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

svm_linear = SVC(kernel='linear', C=1.0)
svm_linear.fit(X_scaled, y_train)`;

  const codeRBF = `from sklearn.svm import SVC

# RBF Kernel SVM
svm_rbf = SVC(kernel='rbf', C=10.0, gamma='scale')
svm_rbf.fit(X_scaled, y_train)

y_pred = svm_rbf.predict(X_test_scaled)`;

  const codeGridSearch = `from sklearn.model_selection import GridSearchCV

param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 0.1, 0.01, 0.001],
    'kernel': ['rbf']
}

grid = GridSearchCV(SVC(), param_grid, refit=True, verbose=2, cv=5)
grid.fit(X_train_scaled, y_train)

print("Best Parameters:", grid.best_params_)
print("Best Accuracy:", grid.best_score_)
best_model = grid.best_estimator_`;

  const codeFull = `import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 1. Load Dataset
data = load_iris()
X = data.data
y = data.target

# 2. Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Scale Features (CRITICAL FOR SVM)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Train RBF Model
svm = SVC(kernel='rbf', C=1.0, gamma='scale')
svm.fit(X_train_scaled, y_train)

# 5. Evaluate
y_pred = svm.predict(X_test_scaled)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\\nClassification Report:\\n", classification_report(y_test, y_pred))`;

  const faqs = [
    { q: isVi ? "Ý tưởng cốt lõi của SVM là gì?" : "What is the main idea of SVM?", a: isVi ? "Tìm một siêu phẳng (hyperplane) phân tách các lớp dữ liệu sao cho lề (margin) giữa các lớp là lớn nhất có thể." : "To find a hyperplane that separates data classes with the maximum possible margin." },
    { q: isVi ? "Support vectors là gì?" : "What are support vectors?", a: isVi ? "Là những điểm dữ liệu nằm gần lề nhất. Chúng quyết định vị trí của đường phân ranh giới. Các điểm ở xa lề hoàn toàn không ảnh hưởng đến mô hình." : "The data points closest to the hyperplane. They define the margin and dictate the position of the decision boundary." },
    { q: isVi ? "Kernel Trick là gì?" : "What is the kernel trick?", a: isVi ? "Là một hàm toán học giúp tính toán khoảng cách giữa các điểm trong không gian đa chiều (giả lập) mà không cần thực sự biến đổi dữ liệu sang không gian đó, giúp SVM xử lý các ranh giới phi tuyến tính một cách hiệu quả." : "A mathematical trick that calculates distances in high-dimensional space without explicitly transforming data, allowing SVM to create nonlinear boundaries efficiently." },
    { q: isVi ? "C kiểm soát điều gì?" : "What does C control?", a: isVi ? "C kiểm soát mức độ trừng phạt đối với các điểm phân loại sai. C lớn = Lề hẹp, ít lỗi (dễ Overfit). C nhỏ = Lề rộng, chấp nhận nhiều lỗi (dễ Generalize)." : "C controls the penalty for misclassification. Large C = narrow margin, fewer errors (may overfit). Small C = wider margin, more errors allowed (may generalize better)." },
    { q: isVi ? "Gamma kiểm soát điều gì?" : "What does gamma control?", a: isVi ? "Gamma xác định vùng ảnh hưởng của một điểm dữ liệu đơn lẻ (trong RBF kernel). Gamma lớn = ảnh hưởng hẹp (ranh giới gập ghềnh). Gamma nhỏ = ảnh hưởng rộng (ranh giới mượt mà)." : "Gamma defines the reach of influence of a single training example in RBF. Large gamma = local influence (wiggly boundary). Small gamma = far reach (smooth boundary)." },
    { q: isVi ? "Tại sao Feature Scaling lại quan trọng?" : "Why is feature scaling important?", a: isVi ? "Vì SVM cố gắng tối đa hóa khoảng cách hình học giữa các điểm. Các đặc trưng có giá trị lớn (ví dụ: lương 100000$) sẽ lấn át hoàn toàn các đặc trưng giá trị nhỏ (ví dụ: tuổi 30)." : "SVM maximizes geometric distances. Features with large numerical ranges (e.g., Salary) will completely dominate features with small ranges (e.g., Age) if not scaled." }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        
        {/* 1. Hero Section */}
        <section id="hero" className="mb-16 scroll-mt-24">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Support Vector Machine (SVM)</h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-6 max-w-2xl">
                {isVi 
                  ? "Một thuật toán Machine Learning cực kỳ mạnh mẽ, thanh lịch về mặt toán học, được thiết kế để phân loại tuyến tính và phi tuyến với độ chính xác cao."
                  : "A powerful, mathematically elegant Machine Learning algorithm designed for both linear and non-linear classification and regression tasks."}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {['Classification', 'Regression', 'Kernel Method', 'Maximum Margin'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 max-w-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-200" />
                  {isVi ? "Tóm tắt nhanh" : "Quick Summary"}
                </h3>
                <p className="text-purple-50">
                  {isVi 
                    ? "SVM vẽ ra ranh giới rộng nhất có thể giữa các lớp dữ liệu. Nó chỉ tập trung vào các điểm dữ liệu nằm ngay sát ranh giới (được gọi là Support Vectors)."
                    : "SVM draws the widest possible boundary between classes. It focuses strictly on the data points lying closest to the boundary (the Support Vectors)."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Introduction */}
        <Section id="intro" title={isVi ? "2. Giới thiệu" : "2. Introduction"}>
          <p>
            {isVi 
              ? "Support Vector Machine (SVM) là một thuật toán học có giám sát siêu việt. Trước khi Deep Learning trỗi dậy, SVM được coi là vị vua tuyệt đối trong các bài toán phân loại."
              : "Support Vector Machine (SVM) is a state-of-the-art supervised learning algorithm. Before the rise of Deep Learning, SVM was considered the absolute king of classification tasks."}
          </p>
          <p>
            {isVi
              ? "Ý tưởng cốt lõi của phân loại SVM là tìm ra một 'đường kẻ' phân chia tốt nhất các điểm dữ liệu. Đối với hồi quy (SVR), nó cố gắng khớp đường kẻ vào càng nhiều điểm càng tốt. SVM đặc biệt tỏa sáng trên các tập dữ liệu nhỏ và vừa (small-to-medium) phức tạp."
              : "The core idea of SVM classification is to find the 'best' separating line. For regression (SVR), it tries to fit as many instances as possible on the line. SVM truly shines on complex, small-to-medium-sized datasets."}
          </p>
        </Section>

        {/* 3. Core Intuition */}
        <Section id="intuition" title={isVi ? "3. Trực giác cốt lõi" : "3. Core Intuition"}>
          <p>
            {isVi 
              ? "Hãy tưởng tượng bạn ném những quả táo và cam lên bàn. Bạn cần đặt một chiếc đũa thẳng chia cách hai loại quả này. Có vô số cách đặt đũa, nhưng cách đặt an toàn nhất là chiếc đũa nằm CÁCH ĐỀU và XA NHẤT so với những quả táo/cam gần nó nhất."
              : "Imagine throwing apples and oranges onto a table. You need to place a stick to separate them. There are infinite ways to place it, but the safest way is to place the stick exactly in the MIDDLE, AS FAR AS POSSIBLE from the closest apples and oranges."}
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong>{isVi ? "Siêu phẳng (Hyperplane)" : "Hyperplane"}:</strong> {isVi ? "Chiếc đũa ranh giới." : "The separating stick."}</li>
            <li><strong>{isVi ? "Lề (Margin)" : "Margin"}:</strong> {isVi ? "Khoảng cách từ chiếc đũa đến các quả gần nhất." : "The distance from the stick to the closest fruits."}</li>
            <li><strong>{isVi ? "Support Vectors" : "Support Vectors"}:</strong> {isVi ? "Chính là những quả táo/cam gần chiếc đũa nhất. Chạm vào chúng là biên giới thay đổi." : "The fruits closest to the stick. They alone determine the boundary."}</li>
          </ul>
        </Section>

        {/* 4. Important Concepts */}
        <Section id="concepts" title={isVi ? "4. Khái niệm quan trọng" : "4. Important Concepts"}>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "Hyperplane", desc: isVi ? "Ranh giới quyết định. Ở 2D nó là đường thẳng, ở 3D là mặt phẳng." : "Decision boundary. In 2D it's a line, in 3D a flat plane." },
              { title: "Margin", desc: isVi ? "Vùng hành lang an toàn giữa các lớp. SVM muốn Margin lớn nhất." : "The safe corridor between classes. SVM maximizes this." },
              { title: "Support Vectors", desc: isVi ? "Các điểm nằm trên ranh giới lề. Xóa điểm khác mô hình không đổi, xóa điểm này mô hình hỏng." : "Points exactly on the margin boundaries. The pillars of the model." },
              { title: "Hard Margin", desc: isVi ? "Biên cứng. Tuyệt đối không cho điểm nào vi phạm lề (Dễ bị Overfit)." : "Strict boundary. Zero tolerance for margin violations." },
              { title: "Soft Margin", desc: isVi ? "Biên mềm. Chấp nhận vài điểm nằm sai phía để mô hình tổng quát hóa tốt hơn." : "Flexible boundary. Allows some misclassification for better generalization." },
              { title: "Kernel Trick", desc: isVi ? "Phép màu toán học biến đổi không gian để tách dữ liệu phi tuyến." : "Mathematical magic that transforms space to separate non-linear data." },
            ].map(c => (
              <div key={c.title} className="p-4 border border-purple-200 dark:border-purple-800 rounded-xl bg-white dark:bg-slate-800">
                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">{c.title}</h4>
                <p className="text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Mathematical Foundation */}
        <Section id="math" title={isVi ? "5. Nền tảng Toán học" : "5. Mathematical Foundation"}>
          <p>{isVi ? "Phương trình Hyperplane được định nghĩa là:" : "The Hyperplane equation is defined as:"}</p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-center mb-4">
            <BlockMath math="w \cdot x + b = 0" />
          </div>
          <p>{isVi ? "Khoảng cách (Lề) giữa 2 biên dương và âm là:" : "The distance (Margin) between the positive and negative boundaries is:"}</p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-center mb-4">
            <BlockMath math="\text{Margin} = \frac{2}{||w||}" />
          </div>
          <p>
            {isVi 
              ? "Để lề lớn nhất (Max Margin), ta phải làm cho ||w|| nhỏ nhất. Quy về bài toán tối ưu:"
              : "To maximize the Margin, we must minimize ||w||. This leads to the optimization problem:"}
          </p>
          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl flex justify-center mb-4">
            <BlockMath math="\min_{w, b} \frac{1}{2} ||w||^2 + C \sum_{i=1}^n \xi_i" />
          </div>
          <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
            <li><InlineMath math="w" /> : {isVi ? "Vector trọng lượng (Vuông góc với Hyperplane)." : "Weight vector (orthogonal to Hyperplane)."}</li>
            <li><InlineMath math="b" /> : {isVi ? "Độ chệch (Bias)." : "Bias (offset)."}</li>
            <li><InlineMath math="C" /> : {isVi ? "Tham số trừng phạt cho Soft Margin." : "Penalty parameter for Soft Margin."}</li>
            <li><InlineMath math="\xi_i" /> : {isVi ? "Biến Slack (Mức độ sai số của điểm i)." : "Slack variable (Error magnitude of point i)."}</li>
          </ul>
        </Section>

        {/* 6. Hard Margin & 7. Soft Margin */}
        <Section id="margin" title={isVi ? "6 & 7. Biên Cứng (Hard) vs Biên Mềm (Soft)" : "6 & 7. Hard Margin vs Soft Margin"}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 border-l-4 border-red-500 bg-white dark:bg-slate-800 rounded-r-xl">
              <h4 className="font-bold text-lg mb-2">Hard Margin</h4>
              <p className="text-sm mb-4">{isVi ? "Chỉ chạy được khi dữ liệu phân tách TUYỆT ĐỐI 100% bằng đường thẳng. Gặp nhiễu (outlier) là mô hình sập." : "Only works if data is STRICTLY linearly separable. Falls apart if there is even a single outlier."}</p>
            </div>
            <div className="p-5 border-l-4 border-green-500 bg-white dark:bg-slate-800 rounded-r-xl">
              <h4 className="font-bold text-lg mb-2">Soft Margin (C Parameter)</h4>
              <p className="text-sm mb-4">{isVi ? "Dùng biến slack (ξ) cho phép lấn tuyến. Thực tế luôn dùng Soft Margin thông qua tham số C." : "Uses slack variables (ξ) to allow margin violations. In practice, we always use Soft Margin via the C parameter."}</p>
            </div>
          </div>
          <InfoBox>
            <strong>{isVi ? "Hiểu tham số C (Cực kỳ quan trọng):" : "Understanding C Parameter (Crucial):"}</strong><br />
            - <strong>Large C:</strong> {isVi ? "Trừng phạt lỗi cực nặng. Đường biên uốn lượn khắt khe, lề hẹp (Dễ Overfit)." : "Heavy penalty for errors. Strict boundary, narrow margin (May Overfit)."}<br />
            - <strong>Small C:</strong> {isVi ? "Thoải mái với lỗi. Đường biên thẳng mượt, lề siêu rộng (Dễ Underfit nhưng Generalize tốt)." : "Tolerant of errors. Smooth boundary, very wide margin (May Underfit but generalizable)."}
          </InfoBox>
        </Section>

        {/* 8. Kernel Trick & 9. RBF Kernel */}
        <Section id="kernel" title={isVi ? "8 & 9. Phép Màu Không Gian - Kernel Trick" : "8 & 9. The Spatial Magic - Kernel Trick"}>
          <p>
            {isVi 
              ? "Giả sử bạn có các quả bóng xanh đỏ nằm trộn lẫn thành một vòng tròn trên mặt bàn. Bạn không thể lấy 1 cây đũa thẳng chia đôi chúng được. Làm sao đây? Kernel Trick sẽ hất tung đống bóng lên không trung (3D). Khi bóng đang lơ lửng, bạn dễ dàng luồn 1 tờ bìa phẳng (Hyperplane 2D) để chia cắt chúng!"
              : "Suppose red and blue balls form concentric circles on a table. No straight line can separate them. Kernel Trick throws the balls into the air (3D). While suspended, you easily slip a flat sheet of paper (2D Hyperplane) between them!"}
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400">Linear Kernel</h4>
              <p className="text-sm">{isVi ? "Không làm gì cả. Dùng đường thẳng thuần túy." : "No transformation. Uses a pure straight line."}</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <h4 className="font-bold text-indigo-600 dark:text-indigo-400">Polynomial Kernel</h4>
              <p className="text-sm">{isVi ? "Thêm chiều bậc cao (x^2, x^3...). Tốt cho ảnh." : "Adds higher degree polynomial features. Good for images."}</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl md:col-span-2 border border-purple-300 dark:border-purple-700">
              <h4 className="font-bold text-purple-700 dark:text-purple-400">RBF Kernel (Radial Basis Function) - Radial/Gaussian</h4>
              <p className="text-sm mb-2">{isVi ? "Phổ biến nhất! Ánh xạ không gian lên VÔ HẠN CHIỀU. Dùng khoảng cách (Euclidean) để đo lường độ giống nhau." : "Most popular! Maps data to INFINITE dimensions. Uses Euclidean distance to measure similarity."}</p>
              <div className="text-sm bg-white dark:bg-slate-900 p-3 rounded">
                <strong>{isVi ? "Tham số Gamma (γ):" : "Gamma Parameter (γ):"}</strong><br />
                - <strong>Large Gamma:</strong> {isVi ? "Ảnh hưởng ngắn. Bao quanh chặt từng điểm (Overfit nặng)." : "Short reach. Tightly wraps individual points (Severe Overfit)."}<br />
                - <strong>Small Gamma:</strong> {isVi ? "Ảnh hưởng xa. Đường ranh giới mượt mà (Tổng quát hóa)." : "Far reach. Smooth boundary lines (Generalization)."}
              </div>
            </div>
          </div>
        </Section>

        {/* 10. Training Process Flowchart */}
        <Section id="process" title={isVi ? "10. Quy trình huấn luyện SVM" : "10. SVM Training Process"}>
          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
             <div className="flex items-center gap-2"><Layers className="text-slate-400" /> <span className="font-bold">1. Data Split</span></div>
             <div className="text-slate-300">→</div>
             <div className="flex items-center gap-2 text-red-500 font-bold"><Activity /> <span>2. Feature Scale (CRITICAL!)</span></div>
             <div className="text-slate-300">→</div>
             <div className="flex items-center gap-2 text-purple-500 font-bold"><Target /> <span>3. Choose Kernel</span></div>
             <div className="text-slate-300">→</div>
             <div className="flex items-center gap-2 text-indigo-500 font-bold"><Code /> <span>4. Tune C & Gamma</span></div>
          </div>
        </Section>

        {/* 11. Feature Scaling */}
        <Section id="scaling" title={isVi ? "11. Tại sao KHÔNG ĐƯỢC QUÊN Feature Scaling?" : "11. Why Feature Scaling Is CRITICAL"}>
          <InfoBox>
            <p className="font-bold text-lg mb-2">⚠ Warning: The biggest SVM mistake</p>
            {isVi 
              ? "SVM tối ưu hóa DỰA TRÊN KHOẢNG CÁCH (Margin). Nếu cột A là Tuổi (0-100) và cột B là Lương (0 - 1,000,000$), thì số 1,000,000 sẽ 'đè bẹp' tác động của Tuổi trong việc tính khoảng cách. Bắt buộc phải dùng StandardScaler để mọi cột có Mean=0, Variance=1 trước khi fit vào SVM."
              : "SVM optimizes BASED ON DISTANCE (Margin). If feature A is Age (0-100) and feature B is Salary (0-1,000,000), the massive numbers in Salary will completely destroy the influence of Age. You absolutely MUST use StandardScaler before fitting an SVM."}
          </InfoBox>
        </Section>

        {/* 12. & 13. & 14. & 15. Python Implementation */}
        <Section id="python" title={isVi ? "12 & 13. Triển khai Python (Scikit-learn)" : "12 & 13. Python Implementation (Scikit-Learn)"}>
          
          <h4 className="font-bold mb-3 mt-6 text-slate-800 dark:text-slate-200">{isVi ? "A. Mô hình Tuyến tính (Linear SVM)" : "A. Linear SVM"}</h4>
          <div className="rounded-xl overflow-hidden mb-6">
            <SyntaxHighlighter language="python" style={vscDarkPlus}>{codeLinear}</SyntaxHighlighter>
          </div>

          <h4 className="font-bold mb-3 mt-6 text-slate-800 dark:text-slate-200">{isVi ? "B. Mô hình Phi tuyến (RBF Kernel)" : "B. Non-linear RBF SVM"}</h4>
          <div className="rounded-xl overflow-hidden mb-6">
            <SyntaxHighlighter language="python" style={vscDarkPlus}>{codeRBF}</SyntaxHighlighter>
          </div>

        </Section>

        {/* 16. GridSearchCV */}
        <Section id="gridsearch" title={isVi ? "16. Tuning Siêu tham số (GridSearchCV)" : "16. Hyperparameter Tuning (GridSearchCV)"}>
          <p className="mb-4">
            {isVi 
              ? "Tuyệt đối không đoán mò C và Gamma. Hãy để máy tính quét lưới tất cả các tổ hợp để tìm ra tham số tốt nhất bằng K-Fold Cross Validation."
              : "Never blind-guess C and Gamma. Let the computer search a grid of all combinations to find the absolute best parameters using K-Fold Cross Validation."}
          </p>
          <div className="rounded-xl overflow-hidden">
            <SyntaxHighlighter language="python" style={vscDarkPlus}>{codeGridSearch}</SyntaxHighlighter>
          </div>
        </Section>

        {/* 17. Full Example Pipeline */}
        <Section id="fullcode" title={isVi ? "17. Code Mẫu Hoàn Chỉnh (Dataset Hoa Iris)" : "17. Full Example Pipeline (Iris Dataset)"}>
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>{codeFull}</SyntaxHighlighter>
          </div>
        </Section>

        {/* 18. Visualization Section */}
        <Section id="visualization" title={isVi ? "18. Trực quan hoá ranh giới SVM" : "18. SVM Visualization"} >
          <div className="grid md:grid-cols-2 gap-6 items-center justify-center bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
              
              {/* Linear SVG */}
              <div className="flex flex-col items-center">
                <span className="font-bold mb-4">Linear Kernel</span>
                <svg width="200" height="200" viewBox="0 0 200 200" className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded">
                  <line x1="40" y1="160" x2="160" y2="40" stroke="currentColor" strokeWidth="3" className="text-purple-500" />
                  <line x1="20" y1="140" x2="140" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-slate-400" />
                  <line x1="60" y1="180" x2="180" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" className="text-slate-400" />
                  
                  {/* Class 1 (Red) */}
                  <circle cx="50" cy="80" r="4" fill="#ef4444" />
                  <circle cx="80" cy="50" r="4" fill="#ef4444" />
                  <circle cx="90" cy="80" r="5" fill="#ef4444" stroke="#000" strokeWidth="2" /> {/* Support Vector */}
                  
                  {/* Class 2 (Blue) */}
                  <circle cx="150" cy="120" r="4" fill="#3b82f6" />
                  <circle cx="120" cy="150" r="4" fill="#3b82f6" />
                  <circle cx="110" cy="120" r="5" fill="#3b82f6" stroke="#000" strokeWidth="2" /> {/* Support Vector */}
                </svg>
              </div>

              {/* RBF SVG */}
              <div className="flex flex-col items-center">
                <span className="font-bold mb-4">RBF Kernel (Non-Linear)</span>
                <svg width="200" height="200" viewBox="0 0 200 200" className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded">
                  <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="3" className="text-purple-500" />
                  
                  {/* Inner Class (Red) */}
                  <circle cx="100" cy="100" r="4" fill="#ef4444" />
                  <circle cx="80" cy="90" r="4" fill="#ef4444" />
                  <circle cx="110" cy="110" r="4" fill="#ef4444" />
                  <circle cx="120" cy="80" r="5" fill="#ef4444" stroke="#000" strokeWidth="2" /> {/* Support Vector */}
                  
                  {/* Outer Class (Blue) */}
                  <circle cx="30" cy="30" r="4" fill="#3b82f6" />
                  <circle cx="170" cy="170" r="4" fill="#3b82f6" />
                  <circle cx="170" cy="30" r="4" fill="#3b82f6" />
                  <circle cx="30" cy="170" r="4" fill="#3b82f6" />
                  <circle cx="90" cy="30" r="5" fill="#3b82f6" stroke="#000" strokeWidth="2" /> {/* Support Vector */}
                </svg>
              </div>

           </div>
        </Section>

        {/* 19. Advantages and Disadvantages */}
        <Section id="pros-cons" title={isVi ? "19. Ưu điểm và Nhược điểm" : "19. Advantages and Disadvantages"}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">{isVi ? "Ưu điểm" : "Advantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-800 dark:text-green-300">
                <li>{isVi ? "Hiệu quả trong không gian số chiều lớn (Thậm chí khi dims > samples)." : "Highly effective in high-dimensional spaces (even when dims > samples)."}</li>
                <li>{isVi ? "Siêu tiết kiệm RAM vì model predict chỉ dùng các Support Vectors." : "Memory efficient because prediction only uses a subset of training points (Support Vectors)."}</li>
                <li>{isVi ? "Kernel Trick giải quyết cực mượt dữ liệu phi tuyến." : "Kernel Trick flawlessly models highly complex, non-linear boundaries."}</li>
              </ul>
            </div>
            <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-3">{isVi ? "Nhược điểm" : "Disadvantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-red-800 dark:text-red-300">
                <li>{isVi ? "Thời gian huấn luyện O(n^3). Chết cứng với dataset quá lớn (>100k dòng)." : "Training time is O(n^3). Freezes on massive datasets (>100k samples)."}</li>
                <li>{isVi ? "Cực kỳ nhạy cảm với scale dữ liệu." : "Extremely sensitive to unscaled data."}</li>
                <li>{isVi ? "Black-box: Khó diễn giải tại sao đưa ra kết quả (khi dùng Kernel phi tuyến)." : "Black-box nature: Hard to interpret the weights in non-linear kernels."}</li>
                <li>{isVi ? "Cần tune quá nhiều (C, Gamma, Kernel) để chạy ổn." : "Requires excessive hyperparameter tuning."}</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 21. How to Choose Kernel */}
        <Section id="choose-kernel" title={isVi ? "21. Hướng dẫn chọn Kernel" : "21. How to Choose Kernel"}>
           <ul className="space-y-3 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <li>🎯 <strong>Linear Kernel:</strong> {isVi ? "Dùng khi số lượng features cực kì lớn (như Text Classification). Dữ liệu có xu hướng tuyến tính sẵn." : "Use when the number of features is massive (e.g. Text Classification)."}</li>
            <li>🔮 <strong>RBF Kernel:</strong> {isVi ? "Là Lựa Chọn Default! Khi bạn không biết dữ liệu như thế nào, hãy phang ngay RBF. Nó xử lý phi tuyến hoàn hảo." : "The Default Choice! If you know nothing about the data, use RBF. It maps nonlinearities perfectly."}</li>
            <li>🧮 <strong>Polynomial Kernel:</strong> {isVi ? "Chỉ dùng khi bạn tin tưởng về mặt domain knowledge rằng sự tương tác bậc 2, bậc 3 của các đặc trưng có ý nghĩa." : "Use only when domain knowledge strongly suggests polynomial interactions."}</li>
           </ul>
        </Section>

        {/* 23. SVM for Regression (SVR) */}
        <Section id="svr" title={isVi ? "23. SVM dùng cho Hồi quy (SVR - Support Vector Regression)" : "23. SVM for Regression (SVR)"}>
          <p>
            {isVi 
              ? "SVM không chỉ phân loại. Khi đổi sang bài toán hồi quy (đoán số), mục tiêu bị ĐẢO NGƯỢC."
              : "SVM isn't just for classification. When flipped to a regression problem (predicting continuous numbers), the goal is INVERTED."}
          </p>
          <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl mt-4">
             {isVi ? "SVR tạo ra một con đường Margin (được định nghĩa bởi Epsilon ε), và nó cố gắng NHÉT TOÀN BỘ các điểm dữ liệu lọt vào CÀNG SÂU TRONG LỀ CÀNG TỐT (trái ngược với phân loại là muốn đẩy các điểm ra xa lề)." : "SVR defines an Epsilon (ε) tube around the hyperplane. It tries to FIT AS MANY POINTS AS POSSIBLE INSIDE THE TUBE (opposite of classification where we want points outside the margin)."}
          </div>
        </Section>

        {/* 24. Applications */}
        <Section id="applications" title={isVi ? "24. Ứng dụng thực tế" : "24. Real World Applications"}>
          <div className="flex flex-wrap gap-3">
            {['Image Classification', 'Bioinformatics', 'Face Detection', 'Text / Spam Classification', 'Handwritten Digit Recognition'].map((app, idx) => (
              <span key={idx} className="px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-semibold rounded-lg border border-purple-200 dark:border-purple-800">
                {app}
              </span>
            ))}
          </div>
        </Section>

        {/* 25. Comparison */}
        <Section id="comparison" title={isVi ? "25. So sánh với Logistic Regression" : "25. Comparison with Logistic Regression"}>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-purple-600">SVM</th>
                  <th className="p-4 font-semibold text-orange-600">Logistic Regression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Optimization</td>
                  <td className="p-4">Maximizes Margin</td>
                  <td className="p-4">Maximizes Likelihood (Log Loss)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">Data Focus</td>
                  <td className="p-4 text-purple-500 font-bold">Only Support Vectors</td>
                  <td className="p-4 text-orange-500 font-bold">All data points</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Non-Linear</td>
                  <td className="p-4 font-bold text-green-500">Yes (Kernel Trick)</td>
                  <td className="p-4 font-bold text-red-500">No (Must add polynomial features manually)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">Output</td>
                  <td className="p-4">Hard classification (Distance)</td>
                  <td className="p-4">Probability (0 to 1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 27. FAQ */}
        <Section id="faq" title={isVi ? "27. Câu hỏi phỏng vấn (FAQ)" : "27. Interview Questions"}>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  {faq.q}
                  {openFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-slate-600 dark:text-slate-400"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Section>

        {/* 28 & 30. Summary */}
        <Section id="summary" title={isVi ? "30. Tổng kết & Lộ trình học" : "30. Summary & Learning Path"}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-purple-900/20 border border-purple-100 dark:border-purple-800 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400 flex items-center gap-2">
               <ListChecks /> {isVi ? "Ghi nhớ cốt lõi" : "Core Takeaways"}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              <li>{isVi ? "SVM tối đa hóa lề (Max Margin) giữa 2 lớp bằng Hyperplane." : "SVM maximizes the margin between two classes using a Hyperplane."}</li>
              <li>{isVi ? "Chỉ các điểm Support Vectors là quan trọng. Bỏ hết điểm khác model vẫn y nguyên." : "Only Support Vectors matter. Delete all other points and the model stays identical."}</li>
              <li>{isVi ? "Kernel Trick (đặc biệt là RBF) giúp chia cắt các ranh giới méo mó, phức tạp." : "Kernel Trick (especially RBF) allows separation of highly complex, squiggly boundaries."}</li>
              <li>{isVi ? "C và Gamma là 2 thông số phải Tune bằng GridSearchCV." : "C and Gamma MUST be tuned using GridSearchCV."}</li>
              <li><strong className="text-red-500">{isVi ? "BẮT BUỘC PHẢI DÙNG STANDARD SCALER." : "STANDARD SCALER IS ABSOLUTELY MANDATORY."}</strong></li>
            </ul>
          </div>
        </Section>

      </div>

      {/* Table of contents sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-purple-600 dark:text-purple-400">{isVi ? "Nội dung" : "Contents"}</h3>
          <nav className="flex flex-col space-y-2 text-sm overflow-y-auto max-h-[75vh] custom-scrollbar">
            {[
              { id: 'hero', text: "1. Hero" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Intro" },
              { id: 'intuition', text: isVi ? "3. Trực giác cốt lõi" : "3. Intuition" },
              { id: 'concepts', text: isVi ? "4. Khái niệm" : "4. Concepts" },
              { id: 'math', text: isVi ? "5. Toán học" : "5. Math" },
              { id: 'margin', text: isVi ? "6-7. Hard/Soft Margin" : "6-7. Margins" },
              { id: 'kernel', text: isVi ? "8-9. Kernel Trick" : "8-9. Kernel Trick" },
              { id: 'process', text: isVi ? "10. Huấn luyện" : "10. Training Flow" },
              { id: 'scaling', text: isVi ? "11. Feature Scaling" : "11. Feature Scaling" },
              { id: 'python', text: "12-15. Python Snippets" },
              { id: 'gridsearch', text: "16. GridSearchCV" },
              { id: 'fullcode', text: isVi ? "17. Code Hoàn chỉnh" : "17. Full Code" },
              { id: 'visualization', text: isVi ? "18. Trực quan hoá" : "18. Visualization" },
              { id: 'pros-cons', text: isVi ? "19. Ưu / Nhược" : "19. Pros & Cons" },
              { id: 'choose-kernel', text: isVi ? "21. Chọn Kernel" : "21. Kernel Choice" },
              { id: 'svr', text: "23. SVR Regression" },
              { id: 'applications', text: isVi ? "24. Ứng dụng" : "24. Applications" },
              { id: 'comparison', text: isVi ? "25. So sánh thuật toán" : "25. Comparison" },
              { id: 'faq', text: "27. FAQ" },
              { id: 'summary', text: "30. Summary" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
