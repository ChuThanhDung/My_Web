import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, BookOpen, Calculator, BrainCircuit } from 'lucide-react';

export default function NaiveBayesContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const Section = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700 pb-3">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="p-5 my-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-xl shadow-sm">
      {children}
    </div>
  );

  const pythonCode = `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 1. Sample Dataset (Spam Classification)
texts = [
    "Free money now", "Hi Bob, how are you", 
    "Win a free ticket", "Meeting at 10am tomorrow",
    "Claim your free prize", "Project deadline is Friday"
]
labels = [1, 0, 1, 0, 1, 0] # 1: Spam, 0: Ham

# 2. Data Preprocessing (Bag of Words)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)
y = np.array(labels)

# 3. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

# 4. Model Training
model = MultinomialNB()
model.fit(X_train, y_train)

# 5. Prediction
y_pred = model.predict(X_test)

# 6. Evaluation
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\\n", confusion_matrix(y_test, y_pred))
print("Classification Report:\\n", classification_report(y_test, y_pred))`;

  const faqs = [
    {
      q: isVi ? "Tại sao lại gọi là 'Naive' (Ngây thơ)?" : "Why is it called 'Naive'?",
      a: isVi ? "Nó được gọi là 'ngây thơ' vì thuật toán giả định một cách mạnh mẽ (và thường là không thực tế) rằng tất cả các đặc trưng (features) đều độc lập với nhau, bất kể chúng có thực sự liên quan trong thực tế hay không." : "It is called 'naive' because the algorithm makes a strong (and often unrealistic) assumption that all features are independent of each other, regardless of whether they actually are in real life."
    },
    {
      q: isVi ? "Khi nào nên sử dụng Naive Bayes?" : "When should we use it?",
      a: isVi ? "Rất thích hợp cho phân loại văn bản (Spam filtering, Sentiment analysis), các bài toán có số lượng chiều (features) lớn, và khi cần một mô hình baseline nhanh chóng." : "It is highly suitable for text classification (Spam filtering, Sentiment analysis), high-dimensional datasets, and when you need a fast baseline model."
    },
    {
      q: isVi ? "Sự khác biệt giữa Gaussian và Multinomial?" : "Difference between Gaussian and Multinomial?",
      a: isVi ? "Gaussian NB dùng cho dữ liệu liên tục tuân theo phân phối chuẩn. Multinomial NB dùng cho dữ liệu rời rạc (như đếm số lượng từ trong văn bản)." : "Gaussian NB is used for continuous data that follows a normal distribution. Multinomial NB is used for discrete counts (like word frequencies in text)."
    },
    {
      q: isVi ? "Tại sao nó hoạt động tốt cho NLP?" : "Why does it work well for NLP?",
      a: isVi ? "Mặc dù giả định độc lập thường bị vi phạm trong ngôn ngữ (các từ thường đi kèm nhau), Naive Bayes vẫn có khả năng đẩy xác suất của lớp đúng lên cao nhất, dẫn đến kết quả phân loại rất tốt mà không cần ước lượng chính xác tuyệt đối xác suất." : "Even though the independence assumption is usually violated in language (words appear together), Naive Bayes is still able to push the correct class probability to be the highest, resulting in excellent classification accuracy without needing perfectly calibrated probabilities."
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        
        {/* 1. Hero Section */}
        <section id="hero" className="mb-16 scroll-mt-24">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Naive Bayes</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
                {isVi 
                  ? "Một thuật toán phân loại dựa trên xác suất cực kỳ mạnh mẽ, đơn giản và hiệu quả, được xây dựng dựa trên Định lý Bayes."
                  : "A remarkably powerful, simple, and efficient probabilistic classification algorithm built on Bayes' Theorem."}
              </p>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl mb-8 max-w-xl">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-200" />
                  {isVi ? "Tóm tắt nhanh" : "Quick Summary"}
                </h3>
                <p className="text-blue-50">
                  {isVi 
                    ? "Sử dụng xác suất có điều kiện để dự đoán nhãn của dữ liệu. Giả định ngây thơ rằng các đặc trưng là độc lập với nhau."
                    : "Uses conditional probability to predict data labels. Naively assumes that all features are independent of one another."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#math" className="px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                  {isVi ? "Khám phá Toán học" : "Explore Math"}
                </a>
                <a href="#python" className="px-6 py-3 bg-blue-700/50 text-white font-bold border border-blue-400/30 rounded-xl hover:bg-blue-700/70 transition-colors">
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
              ? "Naive Bayes là một trong những thuật toán phân loại đơn giản nhưng hiệu quả nhất trong Machine Learning. Nó dựa trên định lý Bayes với một giả định 'ngây thơ' (naive) cực kỳ quan trọng: tất cả các đặc trưng (features) ảnh hưởng đến kết quả một cách hoàn toàn độc lập với nhau."
              : "Naive Bayes is one of the simplest yet most effective classification algorithms in Machine Learning. It relies on Bayes' Theorem with a crucial 'naive' assumption: all features influence the outcome completely independently of each other."}
          </p>
          <p>
            {isVi
              ? "Tuy giả định này hiếm khi đúng trong thế giới thực, Naive Bayes vẫn hoạt động vượt trội, đặc biệt trong các bài toán Xử lý ngôn ngữ tự nhiên (NLP) như lọc thư rác (spam filtering) và phân tích cảm xúc (sentiment analysis)."
              : "Although this assumption is rarely true in the real world, Naive Bayes performs exceptionally well, especially in Natural Language Processing (NLP) tasks like spam filtering and sentiment analysis."}
          </p>
        </Section>

        {/* 3. Bayes Theorem */}
        <Section id="bayes" title={isVi ? "3. Định lý Bayes" : "3. Bayes Theorem"}>
          <p>
            {isVi 
              ? "Định lý Bayes mô tả xác suất của một sự kiện, dựa trên kiến thức trước đó về các điều kiện có thể liên quan đến sự kiện đó:"
              : "Bayes' Theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event:"}
          </p>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 my-6 flex justify-center">
            <BlockMath math="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" />
          </div>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><InlineMath math="P(A|B)" />: <strong>{isVi ? "Xác suất hậu nghiệm (Posterior)" : "Posterior probability"}</strong> {isVi ? "- Xác suất xảy ra A khi B đã xảy ra." : "- Probability of A given that B has occurred."}</li>
            <li><InlineMath math="P(B|A)" />: <strong>{isVi ? "Khả năng (Likelihood)" : "Likelihood"}</strong> {isVi ? "- Xác suất xảy ra B khi A đã xảy ra." : "- Probability of B given that A has occurred."}</li>
            <li><InlineMath math="P(A)" />: <strong>{isVi ? "Xác suất tiên nghiệm (Prior)" : "Prior probability"}</strong> {isVi ? "- Xác suất xảy ra A độc lập." : "- Initial probability of A."}</li>
            <li><InlineMath math="P(B)" />: <strong>{isVi ? "Xác suất cận biên (Marginal)" : "Marginal probability"}</strong> {isVi ? "- Xác suất xảy ra B." : "- Probability of B occurring."}</li>
          </ul>
        </Section>

        {/* 4. Types of Naive Bayes */}
        <Section id="types" title={isVi ? "4. Các loại Naive Bayes" : "4. Types of Naive Bayes"}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Gaussian */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">Gaussian NB</h4>
              <p className="text-sm mb-4">
                {isVi ? "Giả định dữ liệu liên tục tuân theo phân phối chuẩn (hình chuông)." : "Assumes continuous data follows a normal (Gaussian) distribution."}
              </p>
              <div className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 p-2 rounded">
                {isVi ? "Dùng cho: Dữ liệu liên tục (VD: Chiều cao, Cân nặng)" : "Use for: Continuous data (e.g., Height, Weight)"}
              </div>
            </div>
            {/* Multinomial */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">Multinomial NB</h4>
              <p className="text-sm mb-4">
                {isVi ? "Dùng cho dữ liệu tần suất (đếm số lần xuất hiện của sự kiện)." : "Used for frequency data (counts of occurrences)."}
              </p>
              <div className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 p-2 rounded">
                {isVi ? "Dùng cho: Phân loại văn bản, đếm từ" : "Use for: Text classification, word counts"}
              </div>
            </div>
            {/* Bernoulli */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">Bernoulli NB</h4>
              <p className="text-sm mb-4">
                {isVi ? "Dành cho dữ liệu nhị phân (chỉ có 0 và 1)." : "Designed for binary features (only 0s and 1s)."}
              </p>
              <div className="text-xs font-semibold bg-slate-100 dark:bg-slate-700 p-2 rounded">
                {isVi ? "Dùng cho: Có/Không xuất hiện từ trong câu" : "Use for: Word presence/absence in document"}
              </div>
            </div>
          </div>
        </Section>

        {/* 5. Mathematical Explanation */}
        <Section id="math" title={isVi ? "5. Giải thích Toán học (Giả định Độc lập)" : "5. Mathematical Explanation"}>
          <p>
            {isVi ? "Trong bối cảnh học máy, chúng ta muốn tính xác suất của một lớp " : "In machine learning, we want to calculate the probability of a class "}
            <InlineMath math="y" />
            {isVi ? " khi biết tập hợp các đặc trưng " : " given a set of features "}
            <InlineMath math="X = (x_1, x_2, ..., x_n)" />:
          </p>
          <BlockMath math="P(y | x_1, ..., x_n) = \frac{P(x_1, ..., x_n | y) P(y)}{P(x_1, ..., x_n)}" />
          <p>
            {isVi 
              ? "Nhờ giả định 'Ngây thơ' (độc lập có điều kiện), ta có thể tách xác suất gộp thành tích các xác suất đơn lẻ:" 
              : "Due to the 'Naive' (conditional independence) assumption, we can split the joint probability into a product of individual probabilities:"}
          </p>
          <BlockMath math="P(x_1, ..., x_n | y) \approx P(x_1|y) \times P(x_2|y) \times ... \times P(x_n|y) = \prod_{i=1}^n P(x_i|y)" />
          <p>
            {isVi ? "Từ đó, phương trình dự đoán lớp mục tiêu (loại bỏ mẫu số vì nó giống nhau cho mọi lớp) trở thành:" : "Thus, the prediction equation for the target class (dropping the denominator as it's constant for all classes) becomes:"}
          </p>
          <BlockMath math="\hat{y} = \arg\max_y P(y) \prod_{i=1}^n P(x_i|y)" />
        </Section>

        {/* 6. Training Process */}
        <Section id="training" title={isVi ? "6. Quá trình Huấn luyện (Training)" : "6. Training Process"}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl w-40">
              <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="font-bold text-sm">{isVi ? "1. Tính Prior P(y)" : "1. Calc Prior P(y)"}</div>
              <div className="text-xs text-slate-500 mt-1">{isVi ? "Tỉ lệ nhãn y" : "Ratio of label y"}</div>
            </div>
            <div className="text-slate-400 font-bold text-xl">→</div>
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl w-40">
              <BrainCircuit className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
              <div className="font-bold text-sm">{isVi ? "2. Tính Likelihood" : "2. Calc Likelihood"}</div>
              <div className="text-xs text-slate-500 mt-1"><InlineMath math="P(x_i|y)" /></div>
            </div>
            <div className="text-slate-400 font-bold text-xl">→</div>
            <div className="text-center p-4 bg-blue-500 text-white rounded-xl w-40 shadow-lg shadow-blue-500/30">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-100" />
              <div className="font-bold text-sm">{isVi ? "3. Dự đoán" : "3. Predict"}</div>
              <div className="text-xs text-blue-100 mt-1">{isVi ? "Nhân các xác suất" : "Multiply probabilities"}</div>
            </div>
          </div>
        </Section>

        {/* 7. Example Classification */}
        <Section id="example" title={isVi ? "7. Ví dụ Phân loại (Spam Email)" : "7. Example Classification"}>
          <p className="mb-4">
            {isVi 
              ? "Giả sử ta muốn dự đoán email có chứa từ 'Free' và 'Money' có phải là Spam hay không."
              : "Suppose we want to predict if an email containing 'Free' and 'Money' is Spam or not."}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Word</th>
                  <th className="p-4 font-semibold">P(Word | Spam)</th>
                  <th className="p-4 font-semibold">P(Word | Ham)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4">Free</td><td className="p-4">0.7</td><td className="p-4">0.1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4">Money</td><td className="p-4">0.6</td><td className="p-4">0.05</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-mono text-sm">
            <p>P(Spam) = 0.5, P(Ham) = 0.5</p>
            <p className="mt-2 text-red-600 dark:text-red-400">Score(Spam) = P(Spam) * P("Free"|Spam) * P("Money"|Spam) = 0.5 * 0.7 * 0.6 = 0.21</p>
            <p className="mt-1 text-green-600 dark:text-green-400">Score(Ham) = P(Ham) * P("Free"|Ham) * P("Money"|Ham) = 0.5 * 0.1 * 0.05 = 0.0025</p>
            <p className="mt-3 font-bold">{isVi ? "→ Kết luận: Là Spam (0.21 > 0.0025)" : "→ Conclusion: It is Spam (0.21 > 0.0025)"}</p>
          </div>
        </Section>

        {/* 8. Advantages and Disadvantages */}
        <Section id="pros-cons" title={isVi ? "8. Ưu điểm và Nhược điểm" : "8. Advantages and Disadvantages"}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">{isVi ? "Ưu điểm" : "Advantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-green-800 dark:text-green-300">
                <li>{isVi ? "Huấn luyện và dự đoán cực kỳ nhanh." : "Extremely fast training and prediction."}</li>
                <li>{isVi ? "Hoạt động cực tốt với số lượng chiều dữ liệu lớn (như text)." : "Works exceptionally well with high-dimensional data (like text)."}</li>
                <li>{isVi ? "Không cần lượng dữ liệu huấn luyện quá lớn." : "Doesn't require a massive amount of training data."}</li>
                <li>{isVi ? "Không nhạy cảm với các đặc trưng không liên quan." : "Not highly sensitive to irrelevant features."}</li>
              </ul>
            </div>
            <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-3">{isVi ? "Nhược điểm" : "Disadvantages"}</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-red-800 dark:text-red-300">
                <li>{isVi ? "Giả định các đặc trưng độc lập là không thực tế." : "The assumption of independent features is unrealistic."}</li>
                <li>{isVi ? "Gặp vấn đề Zero Probability (Xác suất bằng 0) nếu từ chưa từng xuất hiện." : "Suffers from the Zero Probability problem if a feature never appears."}</li>
                <li>{isVi ? "Khả năng ước lượng xác suất (predict_proba) khá tệ." : "Produces poor probability estimates (predict_proba is not well-calibrated)."}</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* 9. Laplace Smoothing */}
        <Section id="laplace" title={isVi ? "9. Làm trơn Laplace (Laplace Smoothing)" : "9. Laplace Smoothing"}>
          <p>
            {isVi 
              ? "Nếu một từ (đặc trưng) xuất hiện trong tập kiểm tra nhưng chưa từng xuất hiện trong tập huấn luyện, xác suất của nó sẽ là 0. Vì Naive Bayes nhân các xác suất lại với nhau, chỉ cần 1 số 0 sẽ làm kết quả toàn bộ câu bằng 0. Laplace Smoothing giải quyết vấn đề này:"
              : "If a feature appears in the test set but never in the training set, its probability is 0. Since Naive Bayes multiplies probabilities, a single 0 wipes out the whole equation. Laplace Smoothing solves this:"}
          </p>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 my-4 flex justify-center">
            <BlockMath math="P(x_i | y) = \frac{N_{x_i, y} + \alpha}{N_y + \alpha \cdot d}" />
          </div>
          <InfoBox>
            <p className="text-sm">
              {isVi 
                ? "Với α = 1 (Laplace), d là kích thước từ điển. Điều này đảm bảo không có xác suất nào bị tụt xuống 0 hoàn toàn."
                : "Where α = 1 (Laplace), and d is vocabulary size. This ensures no probability ever drops strictly to 0."}
            </p>
          </InfoBox>
        </Section>

        {/* 10. Visualization */}
        <Section id="visualization" title={isVi ? "10. Trực quan hoá" : "10. Visualization Section"}>
           <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col items-center">
                <span className="font-bold mb-4">Gaussian Distribution (Class A vs B)</span>
                <svg width="300" height="150" viewBox="0 0 300 150">
                  {/* Axes */}
                  <line x1="20" y1="130" x2="280" y2="130" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                  
                  {/* Curve 1 (Red) */}
                  <path d="M 20 130 Q 80 130 100 40 Q 120 130 180 130" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="3" />
                  <text x="100" y="25" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">Class A</text>
                  
                  {/* Curve 2 (Blue) */}
                  <path d="M 120 130 Q 180 130 200 60 Q 220 130 280 130" fill="rgba(59, 130, 246, 0.2)" stroke="#3b82f6" strokeWidth="3" />
                  <text x="200" y="45" fill="#3b82f6" fontSize="14" textAnchor="middle" fontWeight="bold">Class B</text>

                  {/* Data Point */}
                  <line x1="160" y1="130" x2="160" y2="80" stroke="currentColor" strokeDasharray="4,4" className="text-slate-500" />
                  <circle cx="160" cy="130" r="4" fill="#000" className="dark:fill-white" />
                  <text x="160" y="145" fill="currentColor" fontSize="12" textAnchor="middle" className="text-slate-600 dark:text-slate-300">New Point x</text>
                </svg>
              </div>
           </div>
           <p className="text-center mt-3 text-sm text-slate-500">
             {isVi ? "Dựa vào độ cao của đồ thị phân phối tại điểm x, ta xác định x thuộc về Class B vì đường màu xanh cao hơn đường màu đỏ tại x." : "Based on the height of the distributions at point x, we assign x to Class B because the blue curve is higher than the red curve."}
           </p>
        </Section>

        {/* 11. Python Implementation */}
        <Section id="python" title={isVi ? "11. Triển khai Python" : "11. Python Implementation"}>
          <p className="mb-4">
            {isVi 
              ? "Sử dụng Scikit-Learn với MultinomialNB để phân loại văn bản:"
              : "Using Scikit-Learn with MultinomialNB for text classification:"}
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg border border-slate-700">
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>

        {/* 12. Real World Applications */}
        <Section id="applications" title={isVi ? "12. Ứng dụng thực tế" : "12. Real World Applications"}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Spam Filtering', 'Sentiment Analysis', 'Document Classification', 'Medical Diagnosis', 'Recommendation Systems'].map((app, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center font-medium text-slate-700 dark:text-slate-300">
                {app}
              </div>
            ))}
          </div>
        </Section>

        {/* 13. Comparison */}
        <Section id="comparison" title={isVi ? "13. So sánh với Thuật toán khác" : "13. Comparison with Other Algorithms"}>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold">Naive Bayes</th>
                  <th className="p-4 font-semibold">Logistic Regression</th>
                  <th className="p-4 font-semibold">KNN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Training Speed</td>
                  <td className="p-4 text-green-500 font-bold">Very Fast</td>
                  <td className="p-4 text-yellow-500">Medium</td>
                  <td className="p-4 text-green-500 font-bold">Zero (Lazy)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="p-4 font-medium">Prediction Speed</td>
                  <td className="p-4 text-green-500 font-bold">Fast</td>
                  <td className="p-4 text-green-500 font-bold">Fast</td>
                  <td className="p-4 text-red-500 font-bold">Very Slow</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="p-4 font-medium">Correlated Features</td>
                  <td className="p-4 text-red-500 font-bold">Poor</td>
                  <td className="p-4 text-green-500 font-bold">Good</td>
                  <td className="p-4 text-yellow-500">Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* 14. Complexity Analysis */}
        <Section id="complexity" title={isVi ? "14. Phân tích độ phức tạp" : "14. Complexity Analysis"}>
           <ul className="space-y-3">
            <li>
              <strong>{isVi ? "Huấn luyện (Training):" : "Training:"} </strong> 
              <InlineMath math="O(n \cdot d)" /> 
              <span className="ml-2 text-sm text-slate-500">{isVi ? "(n = số mẫu, d = số features)" : "(n = samples, d = features)"}</span>
            </li>
            <li>
              <strong>{isVi ? "Dự đoán (Prediction):" : "Prediction:"} </strong> 
              <InlineMath math="O(c \cdot d)" />
              <span className="ml-2 text-sm text-slate-500">{isVi ? "(c = số lớp)" : "(c = classes)"}</span>
            </li>
            <li>
              <strong>{isVi ? "Bộ nhớ (Memory):" : "Memory:"} </strong> 
              <InlineMath math="O(c \cdot d)" />
            </li>
          </ul>
        </Section>

        {/* 15. FAQ */}
        <Section id="faq" title={isVi ? "15. Câu hỏi phỏng vấn (FAQ)" : "15. Interview Questions"}>
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

        {/* 16. Summary */}
        <Section id="summary" title={isVi ? "16. Tổng kết" : "16. Summary Section"}>
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 border border-blue-100 dark:border-blue-800">
            <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">
              {isVi ? "Ghi nhớ cốt lõi" : "Core Takeaways"}
            </h3>
            <p className="text-lg leading-relaxed">
              {isVi 
                ? "Naive Bayes vượt trội nhờ tốc độ, sự đơn giản và hiệu suất cực mạnh trên dữ liệu văn bản (bag-of-words). Dù mang theo giả định 'ngây thơ' về sự độc lập của các đặc trưng, nó vẫn đánh bại nhiều thuật toán phức tạp khác trong các bài toán phân loại văn bản thực tế. Luôn nhớ áp dụng Laplace Smoothing để tránh lỗi xác suất 0!"
                : "Naive Bayes shines due to its speed, simplicity, and immense performance on text data (bag-of-words). Despite carrying the 'naive' assumption of feature independence, it frequently beats more complex algorithms in real-world text classification. Always remember to apply Laplace Smoothing to avoid the zero probability trap!"}
            </p>
          </div>
        </Section>

      </div>

      {/* Table of contents sidebar */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-blue-600 dark:text-blue-400">{isVi ? "Nội dung" : "Contents"}</h3>
          <nav className="flex flex-col space-y-2 text-sm overflow-y-auto max-h-[70vh] custom-scrollbar">
            {[
              { id: 'hero', text: isVi ? "1. Hero" : "1. Hero" },
              { id: 'intro', text: isVi ? "2. Giới thiệu" : "2. Intro" },
              { id: 'bayes', text: isVi ? "3. Định lý Bayes" : "3. Bayes Theorem" },
              { id: 'types', text: isVi ? "4. Các loại NB" : "4. Types" },
              { id: 'math', text: isVi ? "5. Toán học" : "5. Math" },
              { id: 'training', text: isVi ? "6. Huấn luyện" : "6. Training" },
              { id: 'example', text: isVi ? "7. Ví dụ" : "7. Example" },
              { id: 'pros-cons', text: isVi ? "8. Ưu / Nhược" : "8. Pros & Cons" },
              { id: 'laplace', text: isVi ? "9. Laplace" : "9. Laplace Smoothing" },
              { id: 'visualization', text: isVi ? "10. Trực quan hoá" : "10. Visuals" },
              { id: 'python', text: isVi ? "11. Code Python" : "11. Python" },
              { id: 'applications', text: isVi ? "12. Ứng dụng" : "12. Applications" },
              { id: 'comparison', text: isVi ? "13. So sánh" : "13. Comparison" },
              { id: 'complexity', text: isVi ? "14. Độ phức tạp" : "14. Complexity" },
              { id: 'faq', text: isVi ? "15. Câu hỏi" : "15. FAQ" },
              { id: 'summary', text: isVi ? "16. Tổng kết" : "16. Summary" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
