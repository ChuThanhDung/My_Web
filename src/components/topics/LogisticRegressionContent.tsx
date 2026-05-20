import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Calculator, ShieldAlert, GitMerge } from 'lucide-react';

export default function LogisticRegressionContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Section = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400 border-b border-slate-200 dark:border-slate-700 pb-3">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="p-5 my-6 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-r-xl shadow-sm">
      {children}
    </div>
  );

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.datasets import make_classification

# 1. Generate synthetic dataset (Binary Classification)
X, y = make_classification(n_samples=1000, n_features=2, n_informative=2, 
                           n_redundant=0, n_clusters_per_class=1, random_state=42)

# 2. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. Feature Scaling (Crucial for Logistic Regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. Model Training
model = LogisticRegression(C=1.0, solver='lbfgs', random_state=42)
model.fit(X_train_scaled, y_train)

# 5. Prediction (Classes and Probabilities)
y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:, 1] # Probability of Class 1

# 6. Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\\n", classification_report(y_test, y_pred))`;

  const faqs = [
    {
      q: isVi ? "Tại sao gọi là Logistic Regression nhưng lại dùng để Phân loại?" : "Why is it called Logistic Regression if it's used for classification?",
      a: isVi ? "Nó có chữ 'Regression' vì cấu trúc toán học cốt lõi của nó là Hồi quy tuyến tính (tính tổng có trọng số). Tuy nhiên, kết quả được đưa qua hàm Logistic (Sigmoid) để bóp giá trị về [0, 1], phù hợp cho mục đích phân loại xác suất." : "It contains 'Regression' because the underlying math is a linear regression (weighted sum). However, the output is passed through a Logistic (Sigmoid) function to squash the value into the [0, 1] range, making it a probabilistic classification model."
    },
    {
      q: isVi ? "Hàm Sigmoid là gì?" : "What is the sigmoid function?",
      a: isVi ? "Hàm Sigmoid là một hàm toán học có đường cong hình chữ S, biến đổi mọi số thực từ âm vô cùng đến dương vô cùng thành một khoảng giới hạn từ 0 đến 1. Nó đại diện cho xác suất của lớp Positive." : "The Sigmoid function is an S-shaped mathematical curve that maps any real-valued number into a value between 0 and 1. It represents the probability of the positive class."
    },
    {
      q: isVi ? "Ngưỡng quyết định (Decision Threshold) là gì?" : "What is the decision threshold?",
      a: isVi ? "Đây là mốc giá trị xác suất (thường là 0.5) để quyết định phân lớp. Nếu P(y=1) ≥ 0.5, dự đoán lớp 1, ngược lại dự đoán lớp 0. Ngưỡng này có thể thay đổi tùy bài toán." : "It is the probability cutoff (usually 0.5) used to classify samples. If P(y=1) ≥ 0.5, predict class 1, otherwise predict class 0. It can be tuned based on the problem."
    },
    {
      q: isVi ? "Sự khác biệt giữa Logistic Regression và Linear Regression?" : "Difference between Logistic Regression and Linear Regression?",
      a: isVi ? "Linear Regression dự đoán một giá trị liên tục (Ví dụ: giá nhà) và output có thể từ -∞ đến +∞. Logistic Regression dự đoán xác suất rớt vào một lớp (Ví dụ: Chó/Mèo) và output bị giới hạn từ 0 đến 1." : "Linear Regression predicts continuous values (e.g., house prices) with outputs from -∞ to +∞. Logistic Regression predicts class probabilities (e.g., Dog/Cat) bounded between 0 and 1."
    },
    {
      q: isVi ? "Log Loss là gì?" : "What is log loss?",
      a: isVi ? "Log Loss (Binary Cross-Entropy) là hàm chi phí của Logistic Regression. Nó phạt nặng mô hình nếu mô hình tự tin dự đoán sai (VD: đoán 99% là Chó nhưng thực tế là Mèo)." : "Log Loss (Binary Cross-Entropy) is the cost function for Logistic Regression. It heavily penalizes the model for making confident incorrect predictions."
    },
    {
      q: isVi ? "Regularization (Điều chuẩn) là gì?" : "What is regularization?",
      a: isVi ? "Là kỹ thuật thêm một 'hình phạt' vào hàm mất mát đối với các trọng số (weights) quá lớn để ngăn mô hình bị Overfitting (Học vẹt). Có L1 (Lasso) và L2 (Ridge)." : "It is a technique that adds a penalty to the loss function for large weights to prevent Overfitting. Common types are L1 (Lasso) and L2 (Ridge)."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        
        {/* 1. Hero Section */}
        <section id="hero" className="mb-16 scroll-mt-24">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-orange-600 to-red-800 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Logistic Regression</h1>
              <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-2xl">
                {isVi 
                  ? "Đừng để cái tên đánh lừa! Đây không phải là một mô hình hồi quy thông thường, mà là thuật toán phân loại kinh điển và được sử dụng rộng rãi nhất."
                  : "Don't let the name fool you! This is not a standard regression model, but rather a fundamental and widely used classification algorithm."}
              </p>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 max-w-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-orange-200" />
                  {isVi ? "Tóm tắt nhanh" : "Quick Summary"}
                </h3>
                <p className="text-orange-50">
                  {isVi 
                    ? "Dự đoán xác suất xảy ra của một sự kiện bằng cách khớp dữ liệu vào một đường cong Sigmoid. Cốt lõi của hầu hết các mạng nơ-ron cơ bản."
                    : "Predicts the probability of an event by fitting data into a Sigmoid curve. It forms the core of basic neural networks."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#math" className="px-6 py-3 bg-white text-orange-700 font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
                  {isVi ? "Khám phá Toán học" : "Explore Math"}
                </a>
                <a href="#python" className="px-6 py-3 bg-orange-700/50 text-white font-bold border border-orange-400/30 rounded-xl hover:bg-orange-700/70 transition-colors">
                  {isVi ? "Xem Code Python" : "View Python Code"}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Introduction */}
        <Section id="intro" title={isVi ? "2. Giới thiệu" : "2. Introduction"}>
          <p>
            {isVi 
              ? "Logistic Regression là một thuật toán học máy có giám sát chuyên giải quyết các bài toán phân loại (Classification). Mặc dù có từ 'Regression' (Hồi quy) trong tên gọi, nó không dự đoán một số thực liên tục như Linear Regression."
              : "Logistic Regression is a supervised machine learning algorithm used primarily for Classification tasks. Despite having 'Regression' in its name, it does not predict continuous continuous variables like Linear Regression does."}
          </p>
          <p>
            {isVi
              ? "Thay vào đó, nó dự đoán XÁC SUẤT một điểm dữ liệu rớt vào lớp mặc định (ví dụ lớp '1'). Điều này khiến nó trở thành công cụ tuyệt vời cho các bài toán Binary Classification (Phân loại nhị phân: Thắng/Thua, Bệnh/Khoẻ, Rác/Không rác)."
              : "Instead, it predicts the PROBABILITY that a given data point belongs to the default class (e.g., class '1'). This makes it an excellent tool for Binary Classification problems (Win/Loss, Sick/Healthy, Spam/Not Spam)."}
          </p>
        </Section>

        {/* 3. Intuition */}
        <Section id="intuition" title={isVi ? "3. Trực giác (Intuition)" : "3. Intuition"}>
          <p>
            {isVi 
              ? "Trong Linear Regression, một đường thẳng có thể kéo dài từ âm vô cùng đến dương vô cùng. Nếu ta dùng nó để dự đoán xác suất thì sẽ thu được những xác suất vô lý như -0.5 hay 1.8. Xác suất bắt buộc phải nằm trong khoảng [0, 1]."
              : "In Linear Regression, a straight line can stretch from negative infinity to positive infinity. If we use it to predict probabilities, we might get nonsensical values like -0.5 or 1.8. Probabilities must strictly be bounded between [0, 1]."}
          </p>
          <p>
            {isVi
              ? "Vì vậy, Logistic Regression lấy kết quả tuyến tính đó, bóp méo nó thông qua một đường cong chữ S, sao cho mọi giá trị lớn đều tiến về 1, và mọi giá trị âm nhỏ đều tiến về 0. Cuối cùng, chúng ta đặt một 'Ngưỡng quyết định' (Decision Boundary) thường là 0.5: Lớn hơn 0.5 là Lớp 1, nhỏ hơn là Lớp 0."
              : "Thus, Logistic Regression takes that linear output and squashes it through an S-shaped curve, so large positive values approach 1, and large negative values approach 0. Finally, we set a 'Decision Boundary', usually at 0.5: anything above is Class 1, anything below is Class 0."}
          </p>
        </Section>

        {/* 4. Sigmoid Function */}
        <Section id="sigmoid" title={isVi ? "4. Hàm Sigmoid (Hàm Logistic)" : "4. Sigmoid Function"}>
          <p>
            {isVi ? "Trái tim của thuật toán này là Hàm Sigmoid. Công thức:" : "The heart of this algorithm is the Sigmoid function. Formula:"}
          </p>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 my-6 flex justify-center">
            <BlockMath math="\sigma(z) = \frac{1}{1 + e^{-z}}" />
          </div>
          <p className="text-sm">
            {isVi ? "Trong đó:" : "Where:"} <InlineMath math="e" /> {isVi ? "là hằng số Euler (~2.718) và" : "is Euler's number (~2.718) and"} <InlineMath math="z" /> {isVi ? "là giá trị đầu vào (kết quả hồi quy tuyến tính)." : "is the input value (the linear regression output)."}
          </p>
        </Section>

        {/* 5. Mathematical Foundation */}
        <Section id="math" title={isVi ? "5. Nền tảng Toán học" : "5. Mathematical Foundation"}>
          <ol className="list-decimal list-inside space-y-4 ml-4">
            <li>
              <strong>{isVi ? "Tổ hợp tuyến tính (Linear Combination): " : "Linear Combination: "}</strong>
              {isVi ? "Đầu tiên, ta tính tổng có trọng số của các đặc trưng (giống Linear Regression)." : "First, we calculate the weighted sum of the features (just like Linear Regression)."}
              <BlockMath math="z = w_1 x_1 + w_2 x_2 + ... + w_n x_n + b = W^T X + b" />
            </li>
            <li>
              <strong>{isVi ? "Áp dụng Sigmoid: " : "Apply Sigmoid: "}</strong>
              {isVi ? "Đưa " : "Pass "} <InlineMath math="z" /> {isVi ? " qua hàm Sigmoid để lấy xác suất." : " through the Sigmoid function to get the probability."}
              <BlockMath math="\hat{y} = P(y=1 | X) = \sigma(z)" />
            </li>
            <li>
              <strong>{isVi ? "Chuyển thành Nhãn (Class Label): " : "Convert to Class Label: "}</strong>
              {isVi ? "Áp dụng ngưỡng quyết định." : "Apply the decision boundary threshold."}
              <BlockMath math="y_{pred} = \begin{cases} 1 & \text{if } \hat{y} \geq 0.5 \\ 0 & \text{if } \hat{y} < 0.5 \end{cases}" />
            </li>
          </ol>
        </Section>

        {/* 6. Cost Function */}
        <Section id="cost" title={isVi ? "6. Hàm chi phí (Cost Function)" : "6. Cost Function"}>
          <p>
            {isVi 
              ? "Tại sao không dùng Mean Squared Error (MSE) như Linear Regression? Vì nếu kết hợp MSE với Sigmoid, đồ thị hàm mất mát sẽ gồ ghề (Non-convex) và chứa rất nhiều 'hố' tối ưu cục bộ, khiến Gradient Descent khó tìm được đáy."
              : "Why not use Mean Squared Error (MSE) like in Linear Regression? Because passing MSE through a Sigmoid creates a non-convex loss surface with many local minima, making it extremely hard for Gradient Descent to find the global minimum."}
          </p>
          <p>
            {isVi ? "Giải pháp là sử dụng Binary Cross-Entropy (Log Loss):" : "The solution is to use Binary Cross-Entropy (Log Loss):"}
          </p>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 my-4 flex justify-center overflow-x-auto">
            <BlockMath math="J(W) = - \frac{1}{m} \sum_{i=1}^{m} \left[ y^{(i)} \log(\hat{y}^{(i)}) + (1 - y^{(i)}) \log(1 - \hat{y}^{(i)}) \right]" />
          </div>
          <InfoBox>
            {isVi 
              ? "Trực giác: Nếu nhãn thực là 1 nhưng dự đoán là 0.001, giá trị log(0.001) sẽ tiến về âm vô cùng, tạo ra một 'hình phạt' cực lớn. Log Loss ép mô hình phải dự đoán đúng với mức độ tự tin cao."
              : "Intuition: If the true label is 1 but prediction is 0.001, log(0.001) goes to negative infinity, creating a massive penalty. Log Loss forces the model to be confidently correct."}
          </InfoBox>
        </Section>

        {/* 7. Training Process */}
        <Section id="training" title={isVi ? "7. Quá trình Huấn luyện (Training)" : "7. Training Process"}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl w-32 md:w-40">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="font-bold text-sm">{isVi ? "1. Forward Pass" : "1. Forward Pass"}</div>
              <div className="text-xs text-slate-500 mt-1">{isVi ? "Tính xác suất" : "Calc prob"} <InlineMath math="\hat{y}" /></div>
            </div>
            <div className="text-slate-400 font-bold text-xl">→</div>
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl w-32 md:w-40">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="font-bold text-sm">{isVi ? "2. Tính Loss" : "2. Calc Loss"}</div>
              <div className="text-xs text-slate-500 mt-1">{isVi ? "So sánh với y thực" : "Compare with true y"}</div>
            </div>
            <div className="text-slate-400 font-bold text-xl">→</div>
            <div className="text-center p-4 bg-orange-500 text-white rounded-xl w-32 md:w-40 shadow-lg shadow-orange-500/30">
              <GitMerge className="w-8 h-8 mx-auto mb-2 text-orange-100" />
              <div className="font-bold text-sm">{isVi ? "3. Gradient Descent" : "3. Gradient Descent"}</div>
              <div className="text-xs text-orange-100 mt-1">{isVi ? "Cập nhật trọng số" : "Update weights"} <InlineMath math="W" /></div>
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-slate-500">
             {isVi ? "Quá trình này lặp lại liên tục cho đến khi Loss giảm tới mức tối thiểu (Hội tụ)." : "This process repeats iteratively until the Loss is minimized (Convergence)."}
          </p>
        </Section>

        {/* 8. Example Classification */}
        <Section id="example" title={isVi ? "8. Ví dụ: Dự đoán Học sinh Đậu/Rớt" : "8. Example Classification"}>
          <p className="mb-4">
            {isVi 
              ? "Giả sử mô hình đã học được trọng số W = 1.5 và Bias b = -3. Ta có dữ liệu của một học sinh vừa học 4 tiếng."
              : "Assume the trained model has Weight W = 1.5 and Bias b = -3. We have a student who studied for 4 hours."}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Step</th>
                  <th className="p-4 font-semibold">Calculation</th>
                  <th className="p-4 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4">1. Linear eq (<InlineMath math="z" />)</td>
                  <td className="p-4">z = 1.5 * 4 - 3</td>
                  <td className="p-4 font-bold text-orange-500">3.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4">2. Sigmoid (<InlineMath math="\hat{y}" />)</td>
                  <td className="p-4">1 / (1 + e^-3.0)</td>
                  <td className="p-4 font-bold text-blue-500">~ 0.952 (95.2%)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4">3. Decision</td>
                  <td className="p-4">0.952 {'>'} 0.5</td>
                  <td className="p-4 font-bold text-green-500">Pass (Class 1)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 9. Regularization */}
        <Section id="regularization" title={isVi ? "9. Điều chuẩn (Regularization)" : "9. Regularization"}>
          <p>
            {isVi 
              ? "Khi mô hình học quá mức các chi tiết nhỏ lẻ trong tập huấn luyện (Overfitting), nó sẽ thất bại trên dữ liệu thực tế. Regularization giúp ép các trọng số nhỏ lại."
              : "When a model learns the training data too closely including noise (Overfitting), it fails on unseen data. Regularization constrains the weights from getting too large."}
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-orange-600 dark:text-orange-400">L1 Regularization (Lasso)</h4>
              <p className="text-sm mb-2">
                {isVi ? "Cộng thêm giá trị tuyệt đối của trọng số vào hàm Loss." : "Adds the absolute value of magnitude of coefficient as penalty term to the loss function."}
              </p>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Feature Selection (Shrinks to 0)</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-orange-600 dark:text-orange-400">L2 Regularization (Ridge)</h4>
              <p className="text-sm mb-2">
                {isVi ? "Cộng thêm bình phương của trọng số vào hàm Loss." : "Adds squared magnitude of coefficient as penalty term to the loss function."}
              </p>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Default in Scikit-Learn</span>
            </div>
          </div>
        </Section>

        {/* 10. Multiclass */}
        <Section id="multiclass" title={isVi ? "10. Multiclass Logistic Regression" : "10. Multiclass Logistic Regression"}>
           <p>
             {isVi ? "Mặc định Logistic Regression dùng cho nhị phân (2 lớp). Để phân loại nhiều lớp (VD: Mèo, Chó, Ngựa), ta dùng:" : "Standard Logistic Regression is binary. For multiclass problems (e.g., Cat, Dog, Horse), we use:"}
           </p>
           <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
            <li><strong>One-vs-Rest (OvR):</strong> {isVi ? "Tạo ra N mô hình nhị phân phân loại 'Lớp A' vs 'Phần còn lại'." : "Trains N separate binary classifiers predicting 'Class A' vs 'The Rest'."}</li>
            <li><strong>Multinomial / Softmax:</strong> {isVi ? "Thay vì Sigmoid, sử dụng hàm Softmax để tính trực tiếp xác suất gộp cho tất cả các lớp, tổng bằng 1." : "Instead of Sigmoid, uses the Softmax function which calculates probabilities for all classes ensuring they sum to 1."}</li>
          </ul>
        </Section>

        {/* 11. Advantages and Disadvantages */}
        <Section id="pros-cons" title={isVi ? "11. Ưu điểm và Nhược điểm" : "11. Advantages and Disadvantages"}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">{isVi ? "Ưu điểm" : "Advantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-800 dark:text-green-300">
                <li>{isVi ? "Đơn giản, tốc độ huấn luyện nhanh." : "Simple and extremely fast to train."}</li>
                <li>{isVi ? "Dễ diễn giải (Trọng số thể hiện tầm quan trọng của đặc trưng)." : "Highly interpretable (weights show feature importance)."}</li>
                <li>{isVi ? "Hoạt động cực tốt với dữ liệu có thể phân tách tuyến tính." : "Works excellent with linearly separable data."}</li>
                <li>{isVi ? "Cung cấp rõ ràng xác suất của dự đoán." : "Outputs well-calibrated probabilities."}</li>
              </ul>
            </div>
            <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-3">{isVi ? "Nhược điểm" : "Disadvantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-red-800 dark:text-red-300">
                <li>{isVi ? "Giả định ranh giới quyết định là đường thẳng/mặt phẳng." : "Assumes the decision boundary is strictly linear."}</li>
                <li>{isVi ? "Dễ bị ảnh hưởng bởi nhiễu/Outliers cực đoan." : "Can be sensitive to extreme outliers."}</li>
                <li>{isVi ? "Khó nắm bắt các mối quan hệ phức tạp, phi tuyến." : "Performs poorly on complex, non-linear relationships."}</li>
                <li>{isVi ? "Yêu cầu phải chuẩn hoá dữ liệu (Feature Scaling)." : "Requires feature scaling for optimal performance."}</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 12. Visualization */}
        <Section id="visualization" title={isVi ? "12. Trực quan hoá Hàm Sigmoid" : "12. Visualization Section"}>
           <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center">
                <span className="font-bold mb-4">The S-Curve (Sigmoid)</span>
                <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="280" y2="20" stroke="currentColor" strokeDasharray="4,4" className="text-slate-300 dark:text-slate-700" />
                  <text x="5" y="25" fontSize="12" fill="currentColor" className="text-slate-500">1.0</text>
                  
                  <line x1="20" y1="100" x2="280" y2="100" stroke="currentColor" strokeDasharray="4,4" className="text-slate-300 dark:text-slate-700" />
                  <text x="5" y="105" fontSize="12" fill="currentColor" className="text-slate-500">0.5</text>
                  
                  {/* X and Y Axes */}
                  <line x1="20" y1="180" x2="280" y2="180" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                  <line x1="150" y1="20" x2="150" y2="180" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                  
                  {/* Sigmoid Curve */}
                  <path d="M 20 175 Q 120 170 150 100 T 280 25" fill="none" stroke="#f97316" strokeWidth="4" />
                  
                  {/* Annotations */}
                  <circle cx="150" cy="100" r="5" fill="#ef4444" />
                  <text x="160" y="95" fill="#ef4444" fontSize="12" fontWeight="bold">Threshold (0.5)</text>
                  
                  <text x="270" y="195" fill="currentColor" fontSize="12" className="text-slate-500">+z</text>
                  <text x="20" y="195" fill="currentColor" fontSize="12" className="text-slate-500">-z</text>
                </svg>
              </div>
           </div>
           <p className="text-center mt-3 text-sm text-slate-500">
             {isVi ? "Đường cong Sigmoid bóp mọi giá trị của z (từ -∞ đến +∞) về đoạn [0,1]." : "The Sigmoid curve squashes any value of z (from -∞ to +∞) into the [0,1] range."}
           </p>
        </Section>

        {/* 13. Python Implementation */}
        <Section id="python" title={isVi ? "13. Triển khai Python" : "13. Python Implementation"}>
          <p className="mb-4">
            {isVi 
              ? "Triển khai Logistic Regression với Scikit-Learn (có áp dụng Feature Scaling chuẩn hoá dữ liệu):"
              : "Implementing Logistic Regression with Scikit-Learn (including mandatory Feature Scaling):"}
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>

        {/* 14. Real World Applications */}
        <Section id="applications" title={isVi ? "14. Ứng dụng thực tế" : "14. Real World Applications"}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Email Spam Detection', 'Disease Prediction', 
              'Customer Churn Prediction', 'Loan Approval', 
              'Credit Card Fraud', 'Ad Click-Through Rate'
            ].map((app, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center font-medium text-slate-700 dark:text-slate-300">
                {app}
              </div>
            ))}
          </div>
        </Section>

        {/* 15. Comparison */}
        <Section id="comparison" title={isVi ? "15. So sánh thuật toán" : "15. Comparison with Other Algorithms"}>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Algorithm</th>
                  <th className="p-4 font-semibold">Purpose</th>
                  <th className="p-4 font-semibold">Outputs Probability?</th>
                  <th className="p-4 font-semibold">Non-Linear?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-orange-50 dark:bg-orange-900/10">
                  <td className="p-4 font-bold text-orange-600 dark:text-orange-400">Logistic Regression</td>
                  <td className="p-4">Classification</td>
                  <td className="p-4">Yes (Directly)</td>
                  <td className="p-4">No</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Linear Regression</td>
                  <td className="p-4">Regression</td>
                  <td className="p-4">No</td>
                  <td className="p-4">No</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">SVM</td>
                  <td className="p-4">Classification</td>
                  <td className="p-4">No (requires Platt scaling)</td>
                  <td className="p-4">Yes (with Kernels)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Decision Tree</td>
                  <td className="p-4">Both</td>
                  <td className="p-4">Yes (Fractions)</td>
                  <td className="p-4">Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 16. Complexity Analysis */}
        <Section id="complexity" title={isVi ? "16. Phân tích độ phức tạp" : "16. Complexity Analysis"}>
           <ul className="space-y-3">
            <li>
              <strong>{isVi ? "Huấn luyện (Training):" : "Training:"} </strong> 
              <InlineMath math="O(n \cdot d \cdot I)" /> 
              <span className="ml-2 text-sm text-slate-500">{isVi ? "(n = số mẫu, d = features, I = iterations)" : "(n = samples, d = features, I = iterations)"}</span>
            </li>
            <li>
              <strong>{isVi ? "Dự đoán (Prediction):" : "Prediction:"} </strong> 
              <InlineMath math="O(d)" />
              <span className="ml-2 text-sm text-slate-500">{isVi ? "(cực kỳ nhanh vì chỉ cần nhân ma trận 1 lần)" : "(extremely fast due to simple dot product)"}</span>
            </li>
            <li>
              <strong>{isVi ? "Bộ nhớ (Memory):" : "Memory:"} </strong> 
              <InlineMath math="O(d)" />
              <span className="ml-2 text-sm text-slate-500">{isVi ? "(chỉ cần lưu trọng số W)" : "(only need to store weights W)"}</span>
            </li>
          </ul>
        </Section>

        {/* 17. FAQ */}
        <Section id="faq" title={isVi ? "17. Câu hỏi phỏng vấn (FAQ)" : "17. Interview Questions"}>
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

        {/* 18. Summary */}
        <Section id="summary" title={isVi ? "18. Tổng kết" : "18. Summary Section"}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-orange-900/20 border border-orange-100 dark:border-orange-800 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-orange-700 dark:text-orange-400">
              {isVi ? "Ghi nhớ cốt lõi" : "Core Takeaways"}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              <li>{isVi ? "Là mô hình Phân loại (Classification), không phải dự đoán số thực liên tục." : "It is a Classification model, not a standard continuous regression model."}</li>
              <li>{isVi ? "Sử dụng hàm Sigmoid để ánh xạ kết quả hồi quy về xác suất [0-1]." : "Uses the Sigmoid function to map linear outputs into probabilities [0-1]."}</li>
              <li>{isVi ? "Chạy Gradient Descent để tối ưu hóa hàm Log Loss (Cross-Entropy)." : "Runs Gradient Descent to minimize the Log Loss (Cross-Entropy) function."}</li>
              <li>{isVi ? "Siêu nhanh, tốn ít bộ nhớ, giải thích được tính năng (Feature interpretability)." : "Super fast, memory efficient, and offers excellent feature interpretability."}</li>
            </ul>
          </div>
        </Section>

      </div>

      {/* Table of contents sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-orange-600 dark:text-orange-400">{isVi ? "Nội dung" : "Contents"}</h3>
          <nav className="flex flex-col space-y-2 text-sm overflow-y-auto max-h-[75vh] custom-scrollbar">
            {[
              { id: 'hero', text: isVi ? "1. Hero" : "1. Hero" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Intro" },
              { id: 'intuition', text: isVi ? "3. Trực giác" : "3. Intuition" },
              { id: 'sigmoid', text: isVi ? "4. Hàm Sigmoid" : "4. Sigmoid" },
              { id: 'math', text: isVi ? "5. Toán học" : "5. Math" },
              { id: 'cost', text: isVi ? "6. Hàm Loss" : "6. Cost Function" },
              { id: 'training', text: isVi ? "7. Huấn luyện" : "7. Training" },
              { id: 'example', text: isVi ? "8. Ví dụ" : "8. Example" },
              { id: 'regularization', text: isVi ? "9. Điều chuẩn" : "9. Regularization" },
              { id: 'multiclass', text: isVi ? "10. Phân nhiều lớp" : "10. Multiclass" },
              { id: 'pros-cons', text: isVi ? "11. Ưu / Nhược" : "11. Pros & Cons" },
              { id: 'visualization', text: isVi ? "12. Trực quan hoá" : "12. Visuals" },
              { id: 'python', text: isVi ? "13. Code Python" : "13. Python" },
              { id: 'applications', text: isVi ? "14. Ứng dụng" : "14. Applications" },
              { id: 'comparison', text: isVi ? "15. So sánh" : "15. Comparison" },
              { id: 'complexity', text: isVi ? "16. Độ phức tạp" : "16. Complexity" },
              { id: 'faq', text: isVi ? "17. Câu hỏi" : "17. FAQ" },
              { id: 'summary', text: isVi ? "18. Tổng kết" : "18. Summary" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
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
