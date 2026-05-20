import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function PCAContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const Section = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-4 text-primary-600 dark:text-primary-400 border-b border-slate-200 dark:border-slate-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 my-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
      {children}
    </div>
  );

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# 1. Load dataset
data = load_iris()
X = data.data
y = data.target

# 2. Initialize PCA and keep 2 components
pca = PCA(n_components=2)

# 3. Fit and transform the data
X_pca = pca.fit_transform(X)

# 4. Print explained variance ratio
print("Explained variance ratio:", pca.explained_variance_ratio_)

# 5. Visualize the result
plt.figure(figsize=(8, 6))
scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=y, cmap='viridis', edgecolor='k')
plt.xlabel('First Principal Component')
plt.ylabel('Second Principal Component')
plt.title('PCA on Iris Dataset')
plt.legend(handles=scatter.legend_elements()[0], labels=data.target_names.tolist())
plt.show()`;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        <Section id="intro" title={isVi ? "1. Giới thiệu" : "1. Introduction"}>
          <p>
            {isVi 
              ? "Principal Component Analysis (Phân tích thành phần chính - PCA) là một kỹ thuật học máy không giám sát (unsupervised learning) được sử dụng rộng rãi để giảm chiều dữ liệu (dimensionality reduction). PCA giúp chuyển đổi dữ liệu từ không gian nhiều chiều xuống không gian ít chiều hơn nhưng vẫn giữ lại càng nhiều thông tin (phương sai) càng tốt."
              : "Principal Component Analysis (PCA) is a widely used unsupervised machine learning technique for dimensionality reduction. It transforms high-dimensional data into a lower-dimensional space while retaining as much information (variance) as possible."}
          </p>
        </Section>

        <Section id="intuition" title={isVi ? "2. Trực giác (Intuition)" : "2. Intuition"}>
          <p>
            {isVi 
              ? "Hãy tưởng tượng bạn đang chụp một bức ảnh 2D của một vật thể 3D. Tuỳ vào góc chụp, bạn sẽ thu được những thông tin khác nhau. PCA giúp tìm ra 'góc chụp' tốt nhất sao cho hình chiếu của vật thể trên bức ảnh có sự phân tán rộng nhất, từ đó giúp phân biệt các điểm ảnh rõ rệt nhất."
              : "Imagine taking a 2D photograph of a 3D object. Depending on the angle, you capture different amounts of information. PCA finds the best 'camera angle' (projection) that maximizes the spread (variance) of the points, making them as distinguishable as possible."}
          </p>
          <div className="flex justify-center p-6 my-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <svg width="200" height="150" viewBox="0 0 200 150">
              <line x1="20" y1="130" x2="180" y2="130" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
              <line x1="20" y1="130" x2="20" y2="20" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
              <line x1="20" y1="130" x2="180" y2="30" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary-500" />
              <circle cx="50" cy="110" r="4" fill="#3b82f6" />
              <circle cx="70" cy="100" r="4" fill="#3b82f6" />
              <circle cx="90" cy="80" r="4" fill="#3b82f6" />
              <circle cx="110" cy="70" r="4" fill="#3b82f6" />
              <circle cx="130" cy="60" r="4" fill="#3b82f6" />
              <circle cx="150" cy="40" r="4" fill="#3b82f6" />
              <text x="140" y="20" fill="currentColor" className="text-xs font-bold text-primary-500">PC 1 (Max Variance)</text>
            </svg>
          </div>
        </Section>

        <Section id="math" title={isVi ? "3. Cơ sở toán học" : "3. Mathematical foundation"}>
          <p>
            {isVi 
              ? "Giả sử chúng ta có một ma trận dữ liệu "
              : "Let's assume we have a data matrix "}
            <InlineMath math="X" /> 
            {isVi ? " có kích thước " : " of size "} 
            <InlineMath math="n \times d" /> 
            {isVi ? ", trong đó " : ", where "}
            <InlineMath math="n" />
            {isVi ? " là số lượng mẫu và " : " is the number of samples and "}
            <InlineMath math="d" />
            {isVi ? " là số lượng đặc trưng (features)." : " is the number of features."}
          </p>
          <p>
            {isVi ? "Mục tiêu là tìm một vector trọng số " : "The goal is to find a weight vector "}
            <InlineMath math="w" />
            {isVi ? " sao cho phương sai của hình chiếu " : " such that the variance of the projection "}
            <InlineMath math="Xw" />
            {isVi ? " là lớn nhất:" : " is maximized:"}
          </p>
          <BlockMath math="\max_{||w||=1} \text{Var}(Xw) = \max_{||w||=1} w^T \Sigma w" />
          <p>
            {isVi ? "Trong đó " : "Where "}
            <InlineMath math="\Sigma" />
            {isVi ? " là ma trận hiệp phương sai của " : " is the covariance matrix of "}
            <InlineMath math="X" />.
          </p>
        </Section>

        <Section id="covariance" title={isVi ? "4. Ma trận hiệp phương sai (Covariance Matrix)" : "4. Covariance matrix"}>
          <p>
            {isVi ? "Ma trận hiệp phương sai đo lường sự biến thiên cùng nhau giữa các đặc trưng. Đầu tiên, chúng ta phải chuẩn hóa dữ liệu về trung bình bằng 0:" : "The covariance matrix measures the joint variability of two random variables. First, we center the data to have a mean of 0:"}
          </p>
          <BlockMath math="X_{centered} = X - \mu" />
          <p>
            {isVi ? "Sau đó tính ma trận hiệp phương sai " : "Then compute the covariance matrix "}
            <InlineMath math="\Sigma" />:
          </p>
          <BlockMath math="\Sigma = \frac{1}{n-1} X_{centered}^T X_{centered}" />
          <InfoBox>
            {isVi 
              ? "Lưu ý: Việc chuẩn hóa dữ liệu (Standardization) rất quan trọng trong PCA vì nó bị ảnh hưởng nhiều bởi thang đo của từng đặc trưng."
              : "Note: Feature scaling (Standardization) is crucial before applying PCA because it is highly sensitive to the scale of the features."}
          </InfoBox>
        </Section>

        <Section id="eigen" title={isVi ? "5. Trị riêng và vector riêng" : "5. Eigenvalues and eigenvectors"}>
          <p>
            {isVi ? "Giải bài toán tối ưu hoá ở phần 3 đưa ta về bài toán tìm vector riêng và trị riêng của ma trận hiệp phương sai:" : "Solving the optimization problem from section 3 leads to finding the eigenvectors and eigenvalues of the covariance matrix:"}
          </p>
          <BlockMath math="\Sigma w = \lambda w" />
          <p>
            {isVi 
              ? "Các vector riêng (eigenvectors) " : "The eigenvectors "}
            <InlineMath math="w" />
            {isVi 
              ? " đại diện cho các Thành phần chính (Principal Components), và các trị riêng (eigenvalues) " : " represent the Principal Components, and the eigenvalues "}
            <InlineMath math="\lambda" />
            {isVi 
              ? " tương ứng với lượng phương sai mà mỗi thành phần chính giữ lại được." : " correspond to the amount of variance explained by each component."}
          </p>
        </Section>

        <Section id="dim-reduction" title={isVi ? "6. Giảm chiều dữ liệu" : "6. Dimensionality reduction"}>
          <p>
            {isVi 
              ? "Sau khi tìm được các vector riêng, chúng ta sắp xếp chúng theo thứ tự giảm dần của trị riêng tương ứng. Để giảm xuống " : "After finding the eigenvectors, we sort them by descending order of their corresponding eigenvalues. To reduce to "}
            <InlineMath math="k" />
            {isVi ? " chiều, ta chọn " : " dimensions, we select the top "}
            <InlineMath math="k" />
            {isVi ? " vector riêng trên cùng, tạo thành ma trận " : " eigenvectors, forming the projection matrix "}
            <InlineMath math="W_k" />.
          </p>
          <BlockMath math="X_{new} = X_{centered} W_k" />
        </Section>

        <Section id="algorithm" title={isVi ? "7. Thuật toán PCA từng bước" : "7. Step-by-step PCA algorithm"}>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>{isVi ? "Chuẩn hoá dữ liệu (trừ đi mean, chia cho độ lệch chuẩn)." : "Standardize the dataset."}</li>
            <li>{isVi ? "Tính ma trận hiệp phương sai." : "Compute the covariance matrix."}</li>
            <li>{isVi ? "Tính các vector riêng và trị riêng của ma trận hiệp phương sai." : "Calculate the eigenvectors and eigenvalues of the covariance matrix."}</li>
            <li>{isVi ? "Sắp xếp các vector riêng theo trị riêng giảm dần." : "Sort eigenvectors by decreasing eigenvalues."}</li>
            <li>{isVi ? "Chọn k vector riêng hàng đầu." : "Choose the top k eigenvectors."}</li>
            <li>{isVi ? "Chiếu dữ liệu ban đầu lên không gian k chiều mới." : "Project the original data onto the new k-dimensional space."}</li>
          </ol>
        </Section>

        <Section id="pros-cons" title={isVi ? "8. Ưu điểm và nhược điểm" : "8. Advantages and disadvantages"}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">{isVi ? "Ưu điểm" : "Advantages"}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-300">
                <li>{isVi ? "Loại bỏ các đặc trưng tương quan (đa cộng tuyến)." : "Removes correlated features (multicollinearity)."}</li>
                <li>{isVi ? "Giảm thiểu overfitting." : "Helps mitigate overfitting."}</li>
                <li>{isVi ? "Giảm thời gian tính toán và bộ nhớ." : "Reduces training time and storage requirements."}</li>
                <li>{isVi ? "Giúp trực quan hoá dữ liệu không gian nhiều chiều." : "Enables visualization of high-dimensional data."}</li>
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">{isVi ? "Nhược điểm" : "Disadvantages"}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-300">
                <li>{isVi ? "Mất đi khả năng diễn giải (interpretability) của các đặc trưng gốc." : "Loss of interpretability of the original features."}</li>
                <li>{isVi ? "Có thể đánh mất thông tin nếu k quá nhỏ." : "Information loss if k is too small."}</li>
                <li>{isVi ? "Chỉ tìm ra các mối quan hệ tuyến tính." : "Only captures linear correlations (fails for complex non-linear manifolds)."}</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="applications" title={isVi ? "9. Ứng dụng thực tế" : "9. Real-world applications"}>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>{isVi ? "Nén hình ảnh:" : "Image Compression:"}</strong> {isVi ? " Giảm dung lượng ảnh mà vẫn giữ được đặc điểm nhận dạng chính." : " Reduces image size while retaining visual identity."}</li>
            <li><strong>{isVi ? "Xử lý tín hiệu sinh học:" : "Bioinformatics:"}</strong> {isVi ? " Phân tích gen để tìm ra các quần thể biểu hiện gen chung." : " Analyzing gene expressions to find population clusters."}</li>
            <li><strong>{isVi ? "Tài chính định lượng:" : "Quantitative Finance:"}</strong> {isVi ? " Tìm ra các yếu tố chính rủi ro ảnh hưởng tới thị trường chứng khoán." : " Identifying primary risk factors affecting stock portfolios."}</li>
          </ul>
        </Section>

        <Section id="visualization" title={isVi ? "10. Trực quan hoá ví dụ" : "10. Example visualization"}>
          <p className="mb-4">
            {isVi 
              ? "Dưới đây là một minh hoạ giản lược mô tả cách dữ liệu 2D được giảm xuống 1D theo hướng của phương sai lớn nhất:"
              : "Below is a simple illustration of how 2D data is projected onto 1D along the direction of maximum variance:"}
          </p>
          <div className="flex gap-4 items-center justify-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="font-semibold mb-2">Original 2D Data</div>
              <svg width="100" height="100" viewBox="0 0 100 100" className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <circle cx="20" cy="80" r="3" fill="#6366f1" />
                <circle cx="40" cy="60" r="3" fill="#6366f1" />
                <circle cx="60" cy="40" r="3" fill="#6366f1" />
                <circle cx="80" cy="20" r="3" fill="#6366f1" />
                <line x1="10" y1="90" x2="90" y2="10" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>
            <div className="text-2xl text-slate-400">→</div>
            <div className="text-center">
              <div className="font-semibold mb-2">1D Projection (PC1)</div>
              <svg width="100" height="100" viewBox="0 0 100 100" className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                <line x1="10" y1="50" x2="90" y2="50" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="20" cy="50" r="4" fill="#6366f1" />
                <circle cx="40" cy="50" r="4" fill="#6366f1" />
                <circle cx="60" cy="50" r="4" fill="#6366f1" />
                <circle cx="80" cy="50" r="4" fill="#6366f1" />
              </svg>
            </div>
          </div>
        </Section>

        <Section id="python" title={isVi ? "11. Triển khai bằng Python" : "11. Python implementation"}>
          <p className="mb-4">
            {isVi 
              ? "Sử dụng thư viện scikit-learn để thực thi PCA dễ dàng chỉ với vài dòng mã:"
              : "Using scikit-learn to implement PCA is straightforward:"}
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>

        <Section id="complexity" title={isVi ? "12. Phân tích độ phức tạp" : "12. Complexity analysis"}>
          <ul className="space-y-3">
            <li>
              <strong>{isVi ? "Độ phức tạp thời gian:" : "Time Complexity:"} </strong> 
              <InlineMath math="O(d^2 n + d^3)" />. 
              <br/>
              <span className="text-sm opacity-80">
                {isVi 
                  ? "Xây dựng ma trận hiệp phương sai mất O(d²n). Tính toán các trị riêng mất O(d³)."
                  : "Constructing covariance matrix takes O(d²n). Eigenvalue decomposition takes O(d³)."}
              </span>
            </li>
            <li>
              <strong>{isVi ? "Độ phức tạp không gian:" : "Space Complexity:"} </strong> 
              <InlineMath math="O(d^2)" />.
              <br/>
              <span className="text-sm opacity-80">
                {isVi 
                  ? "Cần phải lưu trữ ma trận hiệp phương sai d x d."
                  : "Need to store the d x d covariance matrix."}
              </span>
            </li>
          </ul>
        </Section>

        <Section id="summary" title={isVi ? "13. Tổng kết" : "13. Summary"}>
          <InfoBox>
            <p className="font-medium text-blue-900 dark:text-blue-200">
              {isVi 
                ? "PCA là công cụ mạnh mẽ nền tảng cho việc phân tích dữ liệu đa chiều. Mặc dù có hạn chế với các tập dữ liệu có mối quan hệ phi tuyến tính, nhưng nó vẫn là sự lựa chọn tiêu chuẩn số một cho tiền xử lý giảm chiều và trực quan hóa dữ liệu trước khi đi vào các mô hình học máy phức tạp."
                : "PCA is a foundational tool for high-dimensional data analysis. Despite its limitations with non-linear relationships, it remains the standard first-choice for dimensionality reduction and data visualization before applying complex machine learning models."}
            </p>
          </InfoBox>
        </Section>
      </div>

      {/* Table of contents sidebar for desktop */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4">{isVi ? "Mục lục" : "On this page"}</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            {[
              { id: 'intro', text: isVi ? "1. Giới thiệu" : "1. Introduction" },
              { id: 'intuition', text: isVi ? "2. Trực giác" : "2. Intuition" },
              { id: 'math', text: isVi ? "3. Cơ sở toán học" : "3. Math Foundation" },
              { id: 'covariance', text: isVi ? "4. Ma trận Covariance" : "4. Covariance Matrix" },
              { id: 'eigen', text: isVi ? "5. Trị riêng & Vector riêng" : "5. Eigenvectors" },
              { id: 'dim-reduction', text: isVi ? "6. Giảm chiều dữ liệu" : "6. Dim Reduction" },
              { id: 'algorithm', text: isVi ? "7. Thuật toán" : "7. Algorithm" },
              { id: 'pros-cons', text: isVi ? "8. Ưu / Nhược điểm" : "8. Pros & Cons" },
              { id: 'applications', text: isVi ? "9. Ứng dụng" : "9. Applications" },
              { id: 'visualization', text: isVi ? "10. Trực quan hoá" : "10. Visualization" },
              { id: 'python', text: isVi ? "11. Code Python" : "11. Python Code" },
              { id: 'complexity', text: isVi ? "12. Độ phức tạp" : "12. Complexity" },
              { id: 'summary', text: isVi ? "13. Tổng kết" : "13. Summary" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
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
