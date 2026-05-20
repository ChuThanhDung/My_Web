import { useTranslation } from 'react-i18next';
import { BlockMath, InlineMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function KMeansContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const Section = ({ title, children, id }: { title: string, children: React.ReactNode, id: string }) => (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </section>
  );

  const InfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className="p-4 my-6 bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 rounded-r-lg">
      {children}
    </div>
  );

  const pythonCode = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 1. Generate synthetic data
X, y_true = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

# 2. Initialize KMeans with K=4
kmeans = KMeans(n_clusters=4, init='k-means++', n_init=10, max_iter=300, random_state=42)

# 3. Fit and predict clusters
y_kmeans = kmeans.fit_predict(X)

# 4. Get the cluster centroids
centers = kmeans.cluster_centers_

# 5. Visualize the result
plt.figure(figsize=(8, 6))
plt.scatter(X[:, 0], X[:, 1], c=y_kmeans, s=50, cmap='viridis', alpha=0.7)
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.9, marker='X', label='Centroids')
plt.title('K-Means Clustering (K=4)')
plt.legend()
plt.show()`;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        <Section id="intro" title={isVi ? "1. Giới thiệu" : "1. Introduction"}>
          <p>
            {isVi 
              ? "K-Means là một thuật toán học máy không giám sát (unsupervised learning) vô cùng phổ biến được dùng để phân cụm dữ liệu (Clustering). Mục tiêu của K-Means là chia tập dữ liệu thành K nhóm (cụm) riêng biệt sao cho các điểm dữ liệu trong cùng một nhóm có tính chất giống nhau nhất có thể, đồng thời khác biệt với các nhóm còn lại."
              : "K-Means is a highly popular unsupervised machine learning algorithm used for clustering. The goal of K-Means is to partition a dataset into K distinct, non-overlapping groups (clusters) such that data points within the same group are as similar as possible, while being distinct from other groups."}
          </p>
        </Section>

        <Section id="intuition" title={isVi ? "2. Trực giác (Intuition)" : "2. Intuition"}>
          <p>
            {isVi 
              ? "Hãy tưởng tượng bạn có một rổ hoa quả lộn xộn gồm táo, cam và chuối. Bạn muốn phân loại chúng vào 3 rổ riêng biệt (K=3). Ban đầu bạn đặt ngẫu nhiên 3 chiếc rổ (centroids). Sau đó, bạn cầm từng quả lên, xem nó giống loại nào nhất (gần rổ nào nhất) thì đặt vào đó. Sau khi phân xong, bạn di chuyển vị trí của các rổ ra chính giữa đống hoa quả vừa gom được. Bạn lặp lại quá trình này cho đến khi vị trí các rổ không còn thay đổi."
              : "Imagine you have a messy basket of mixed fruits: apples, oranges, and bananas. You want to sort them into 3 separate baskets (K=3). First, you randomly place 3 baskets (centroids). Then, you pick up each fruit and place it in the basket it most closely resembles (closest distance). After sorting all fruits, you move the baskets to the center of each fruit pile. You repeat this process until the baskets stop moving."}
          </p>
        </Section>

        <Section id="math" title={isVi ? "3. Cơ sở toán học (Objective Function)" : "3. Mathematical foundation"}>
          <p>
            {isVi 
              ? "Thuật toán K-Means cố gắng giảm thiểu Tổng bình phương khoảng cách trong nội bộ cụm (Within-Cluster Sum of Squares - WCSS), hay còn gọi là hàm mất mát (Inertia):"
              : "The K-Means algorithm tries to minimize the Within-Cluster Sum of Squares (WCSS), also known as the Inertia objective function:"}
          </p>
          <BlockMath math="J = \sum_{j=1}^{K} \sum_{i=1}^{n} w_{ij} || x_i - \mu_j ||^2" />
          <p>
            {isVi ? "Trong đó:" : "Where:"}
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><InlineMath math="K" /> {isVi ? "là số lượng cụm." : "is the number of clusters."}</li>
            <li><InlineMath math="\mu_j" /> {isVi ? "là tâm (centroid) của cụm " : "is the centroid of cluster "} <InlineMath math="j" />.</li>
            <li><InlineMath math="x_i" /> {isVi ? "là điểm dữ liệu thứ " : "is the "} <InlineMath math="i" /> {isVi ? "i." : "-th data point."}</li>
            <li><InlineMath math="w_{ij}" /> {isVi ? "là 1 nếu điểm i thuộc cụm j, ngược lại bằng 0." : "is 1 if data point i belongs to cluster j, and 0 otherwise."}</li>
          </ul>
        </Section>

        <Section id="algorithm" title={isVi ? "4. Thuật toán từng bước" : "4. Step-by-step algorithm"}>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li>
              <strong>{isVi ? "Khởi tạo (Initialization): " : "Initialization: "}</strong>
              {isVi ? "Chọn ngẫu nhiên K điểm từ tập dữ liệu để làm tâm cụm (centroids) ban đầu." : "Randomly select K data points from the dataset to serve as initial centroids."}
            </li>
            <li>
              <strong>{isVi ? "Gán cụm (Assignment): " : "Assignment: "}</strong>
              {isVi ? "Tính khoảng cách từ mỗi điểm dữ liệu tới K tâm cụm và gán điểm đó vào cụm có tâm gần nó nhất." : "Calculate the distance from each point to the K centroids and assign the point to the closest cluster."}
            </li>
            <li>
              <strong>{isVi ? "Cập nhật (Update): " : "Update: "}</strong>
              {isVi ? "Tính lại vị trí tâm của mỗi cụm bằng cách lấy trung bình cộng toạ độ của tất cả các điểm thuộc cụm đó." : "Recalculate the position of each centroid by taking the mean of all data points assigned to that cluster."}
            </li>
            <li>
              <strong>{isVi ? "Lặp lại (Repeat): " : "Repeat: "}</strong>
              {isVi ? "Lặp lại bước 2 và 3 cho đến khi thuật toán hội tụ (các tâm cụm không thay đổi hoặc đạt giới hạn số lần lặp)." : "Repeat steps 2 and 3 until convergence (centroids stop changing or max iterations reached)."}
            </li>
          </ol>
        </Section>

        <Section id="choosing-k" title={isVi ? "5. Cách chọn số cụm (K)" : "5. Choosing K"}>
          <p>
            {isVi ? "Một trong những thách thức lớn nhất của K-Means là bạn phải biết trước số cụm K. Dưới đây là hai phương pháp phổ biến:" : "One of the biggest challenges in K-Means is that you must define K beforehand. Here are two popular methods:"}
          </p>
          <div className="space-y-4 mt-4">
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-emerald-600 dark:text-emerald-400">The Elbow Method ({isVi ? "Phương pháp cùi chỏ" : "Elbow Method"})</h4>
              <p className="text-sm">
                {isVi 
                  ? "Vẽ biểu đồ giá trị WCSS theo từng giá trị của K. WCSS luôn giảm khi K tăng. Bạn chọn giá trị K tại điểm 'cùi chỏ' (nơi tốc độ giảm của WCSS bắt đầu chậm lại rõ rệt)."
                  : "Plot the WCSS value against different values of K. WCSS always decreases as K increases. You choose K at the 'elbow' point (where the rate of decrease drops sharply)."}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
              <h4 className="font-bold text-lg mb-2 text-emerald-600 dark:text-emerald-400">Silhouette Score</h4>
              <p className="text-sm">
                {isVi 
                  ? "Đo lường mức độ giống nhau của một điểm so với cụm của nó (cohesion) so với các cụm khác (separation). Giá trị dao động từ -1 đến 1. K mang lại điểm Silhouette trung bình cao nhất thường là lựa chọn tốt nhất."
                  : "Measures how similar a point is to its own cluster (cohesion) compared to other clusters (separation). Values range from -1 to 1. The K with the highest average Silhouette score is typically optimal."}
              </p>
            </div>
          </div>
        </Section>

        <Section id="pros-cons" title={isVi ? "6. Ưu điểm và nhược điểm" : "6. Advantages and disadvantages"}>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">{isVi ? "Ưu điểm" : "Advantages"}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-300">
                <li>{isVi ? "Dễ hiểu, dễ cài đặt." : "Simple to understand and implement."}</li>
                <li>{isVi ? "Rất nhanh và hiệu quả với các tập dữ liệu cực lớn." : "Fast and efficient, scaling well to large datasets."}</li>
                <li>{isVi ? "Luôn hội tụ (đảm bảo tìm được một nghiệm)." : "Guarantees convergence."}</li>
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-400 mb-2">{isVi ? "Nhược điểm" : "Disadvantages"}</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-300">
                <li>{isVi ? "Phải chỉ định số K trước." : "Requires K to be specified in advance."}</li>
                <li>{isVi ? "Nhạy cảm với các điểm dị biệt (Outliers)." : "Highly sensitive to outliers."}</li>
                <li>{isVi ? "Nhạy cảm với điểm khởi tạo tâm ngẫu nhiên (thường giải quyết bằng K-Means++)." : "Sensitive to initial centroid placement (usually fixed with K-Means++)."}</li>
                <li>{isVi ? "Không hoạt động tốt với các cụm có hình dạng phi tuyến tính hoặc kích thước khác nhau." : "Fails on clusters with complex non-linear shapes or varying densities."}</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="applications" title={isVi ? "7. Ứng dụng thực tế" : "7. Real-world applications"}>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>{isVi ? "Phân khúc khách hàng (Customer Segmentation):" : "Customer Segmentation:"}</strong> {isVi ? " Nhóm khách hàng theo thói quen mua sắm, độ tuổi, sở thích để có chiến lược Marketing phù hợp." : " Grouping customers by purchase behavior, age, or interests for targeted marketing."}</li>
            <li><strong>{isVi ? "Phân loại tài liệu:" : "Document Classification:"}</strong> {isVi ? " Gom cụm các bài báo, tin tức có chủ đề giống nhau." : " Clustering articles and news documents with similar themes."}</li>
            <li><strong>{isVi ? "Nén hình ảnh (Image Quantization):" : "Image Quantization:"}</strong> {isVi ? " Giảm số lượng màu sắc trong một bức ảnh bằng cách gom cụm các pixel có màu gần giống nhau." : " Reducing the number of colors in an image by clustering pixels of similar color."}</li>
          </ul>
        </Section>

        <Section id="visualization" title={isVi ? "8. Trực quan hoá ví dụ" : "8. Example visualization"}>
          <p className="mb-4">
            {isVi 
              ? "Hình ảnh minh hoạ thuật toán tìm ra 3 tâm cụm (K=3) từ dữ liệu ban đầu:"
              : "Illustration of the algorithm finding 3 cluster centroids (K=3) from scattered data:"}
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="font-semibold mb-2">Unclustered Data</div>
              <svg width="150" height="150" viewBox="0 0 150 150" className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                {/* Random gray points */}
                {[...Array(15)].map((_,i) => <circle key={`u1-${i}`} cx={20 + Math.random()*40} cy={20 + Math.random()*40} r="3" fill="#94a3b8" />)}
                {[...Array(15)].map((_,i) => <circle key={`u2-${i}`} cx={90 + Math.random()*40} cy={30 + Math.random()*40} r="3" fill="#94a3b8" />)}
                {[...Array(15)].map((_,i) => <circle key={`u3-${i}`} cx={50 + Math.random()*40} cy={90 + Math.random()*40} r="3" fill="#94a3b8" />)}
              </svg>
            </div>
            <div className="text-2xl text-slate-400 rotate-90 md:rotate-0">→</div>
            <div className="text-center">
              <div className="font-semibold mb-2">Clustered (K=3)</div>
              <svg width="150" height="150" viewBox="0 0 150 150" className="bg-slate-50 dark:bg-slate-900 rounded-lg">
                {/* Cluster 1 - Blue */}
                {[...Array(15)].map((_,i) => <circle key={`c1-${i}`} cx={20 + Math.random()*40} cy={20 + Math.random()*40} r="3" fill="#3b82f6" />)}
                <path d="M 35 35 l 10 10 M 45 35 l -10 10" stroke="#1d4ed8" strokeWidth="3" />
                
                {/* Cluster 2 - Green */}
                {[...Array(15)].map((_,i) => <circle key={`c2-${i}`} cx={90 + Math.random()*40} cy={30 + Math.random()*40} r="3" fill="#10b981" />)}
                <path d="M 105 45 l 10 10 M 115 45 l -10 10" stroke="#047857" strokeWidth="3" />
                
                {/* Cluster 3 - Orange */}
                {[...Array(15)].map((_,i) => <circle key={`c3-${i}`} cx={50 + Math.random()*40} cy={90 + Math.random()*40} r="3" fill="#f59e0b" />)}
                <path d="M 65 105 l 10 10 M 75 105 l -10 10" stroke="#b45309" strokeWidth="3" />
              </svg>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 mt-2">
             {isVi ? "Dấu X đại diện cho tâm (Centroid) của từng cụm." : "The X marks represent the centroid of each cluster."}
          </p>
        </Section>

        <Section id="python" title={isVi ? "9. Triển khai bằng Python" : "9. Python implementation"}>
          <p className="mb-4">
            {isVi 
              ? "Triển khai K-Means vô cùng đơn giản với scikit-learn. Đoạn mã dưới đây cũng sử dụng K-Means++ để khởi tạo tâm thông minh hơn:"
              : "Implementing K-Means is incredibly simple with scikit-learn. The code below also uses K-Means++ for smarter centroid initialization:"}
          </p>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <SyntaxHighlighter language="python" style={vscDarkPlus} showLineNumbers>
              {pythonCode}
            </SyntaxHighlighter>
          </div>
        </Section>

        <Section id="complexity" title={isVi ? "10. Phân tích độ phức tạp" : "10. Complexity analysis"}>
          <ul className="space-y-3">
            <li>
              <strong>{isVi ? "Độ phức tạp thời gian:" : "Time Complexity:"} </strong> 
              <InlineMath math="O(I \cdot K \cdot n \cdot d)" />. 
              <br/>
              <span className="text-sm opacity-80">
                {isVi 
                  ? "Với I là số lần lặp, K là số cụm, n là số điểm dữ liệu và d là số chiều (features). Thuật toán thường hội tụ rất nhanh."
                  : "Where I is iterations, K is clusters, n is data points, and d is dimensions. It usually converges very quickly."}
              </span>
            </li>
            <li>
              <strong>{isVi ? "Độ phức tạp không gian:" : "Space Complexity:"} </strong> 
              <InlineMath math="O(n \cdot d + K \cdot d)" />.
              <br/>
              <span className="text-sm opacity-80">
                {isVi 
                  ? "Cần lưu trữ dữ liệu đầu vào và vị trí của K tâm cụm."
                  : "Needs to store the input data and the positions of K centroids."}
              </span>
            </li>
          </ul>
        </Section>

        <Section id="summary" title={isVi ? "11. Tổng kết" : "11. Summary"}>
          <InfoBox>
            <p className="font-medium text-emerald-900 dark:text-emerald-200">
              {isVi 
                ? "K-Means là thuật toán học máy 'go-to' đầu tiên khi bạn muốn giải quyết một bài toán phân cụm. Mặc dù cần phải định trước số cụm K và nhạy cảm với Outliers, tốc độ tính toán siêu việt và sự đơn giản của nó vẫn giữ K-Means ở vị thế hàng đầu trong vô vàn các ứng dụng phân tích dữ liệu thực tế."
                : "K-Means is the 'go-to' algorithm when tackling a clustering problem. Despite requiring K to be predefined and being sensitive to outliers, its incredible computational speed and simplicity keep it at the forefront of numerous real-world data analysis applications."}
            </p>
          </InfoBox>
        </Section>
      </div>

      {/* Table of contents sidebar for desktop */}
      <div className="hidden lg:block lg:w-1/4">
        <div className="sticky top-24 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 text-emerald-600 dark:text-emerald-400">{isVi ? "Mục lục" : "On this page"}</h3>
          <nav className="flex flex-col space-y-2 text-sm">
            {[
              { id: 'intro', text: isVi ? "1. Giới thiệu" : "1. Introduction" },
              { id: 'intuition', text: isVi ? "2. Trực giác" : "2. Intuition" },
              { id: 'math', text: isVi ? "3. Cơ sở toán học" : "3. Math Foundation" },
              { id: 'algorithm', text: isVi ? "4. Thuật toán" : "4. Algorithm" },
              { id: 'choosing-k', text: isVi ? "5. Chọn số cụm K" : "5. Choosing K" },
              { id: 'pros-cons', text: isVi ? "6. Ưu / Nhược điểm" : "6. Pros & Cons" },
              { id: 'applications', text: isVi ? "7. Ứng dụng" : "7. Applications" },
              { id: 'visualization', text: isVi ? "8. Trực quan hoá" : "8. Visualization" },
              { id: 'python', text: isVi ? "9. Code Python" : "9. Python Code" },
              { id: 'complexity', text: isVi ? "10. Độ phức tạp" : "10. Complexity" },
              { id: 'summary', text: isVi ? "11. Tổng kết" : "11. Summary" },
            ].map(item => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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
