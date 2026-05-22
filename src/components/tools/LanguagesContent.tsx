import { useTranslation } from 'react-i18next';
import { Section, ComparisonTable, CommonMistakes, SummaryCard, StepGuide, InfoBox } from '../sampling/SamplingSharedComponents';
import LanguagesVisualizer from './LanguagesVisualizer';

export default function LanguagesContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Steps
  const stepsEn = [
    { title: 'Project Scope & Tool Choice', desc: 'Select R if the project requires complex mathematical models, survival analysis, or journal-grade charts. Select Python if the outcome will integrate into an app, API, or deep learning model.' },
    { title: 'Data Loading & Environment Setup', desc: 'Initialize your environment (Jupyter Notebook for Python, RStudio for R). Load datasets using pandas (.read_csv) or readr (read_csv).' },
    { title: 'Vectorized Data Wrangling', desc: 'Clean missing data, filter records, and mutate columns. Prefer pandas vector operations or R dplyr pipes (%>%) over slow manual loops.' },
    { title: 'Statistical Modeling & Diagnostic Testing', desc: 'Fit models using statsmodels (Python) or lm/glm (R). Analyze residuals, collinearity (VIF), and check hypothesis assumptions.' },
    { title: 'Visualization & Report Compiling', desc: 'Generate plots (matplotlib/seaborn vs ggplot2) and compile interactive reports using Jupyter Markdown or R Markdown / Quarto.' }
  ];

  const stepsVi = [
    { title: 'Xác định yêu cầu & Chọn Công cụ', desc: 'Chọn R nếu dự án đòi hỏi kiểm định thống kê phức tạp, phân tích thời gian sống hoặc vẽ biểu đồ xuất bản báo chí. Chọn Python nếu cần tích hợp hệ thống, API hoặc chạy học sâu.' },
    { title: 'Thiết lập Môi trường & Đọc Dữ liệu', desc: 'Khởi tạo thư mục làm việc (Jupyter Notebook cho Python, RStudio cho R). Tải tập dữ liệu thô thông qua thư viện pandas hoặc readr.' },
    { title: 'Tiền xử lý Dữ liệu dạng Vector', desc: 'Làm sạch dữ liệu trống, lọc dòng và biến đổi cột. Ưu tiên các phép toán vector của pandas hoặc bộ lọc dplyr của R thay vì viết vòng lặp for thủ công chậm chạp.' },
    { title: 'Xây dựng Mô hình & Kiểm định Chẩn đoán', desc: 'Khớp mô hình hồi quy bằng statsmodels (Python) hoặc lm/glm (R). Xem xét phân phối phần dư, kiểm tra đa cộng tuyến (VIF) và các giả định của mô hình.' },
    { title: 'Trực quan hóa & Kết xuất Báo cáo', desc: 'Vẽ đồ thị trực quan (matplotlib/seaborn đối với Python, ggplot2 đối với R) và đóng gói báo cáo dạng tài liệu tương tác qua Jupyter hoặc R Markdown/Quarto.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Using nested loops (for/while) in R or Python to process row-by-row data.',
      fix: 'Always leverage vectorized operations. Functions in numpy/pandas (Python) and dplyr/base (R) are implemented in C/C++ and run hundreds of times faster.'
    },
    {
      mistake: 'Confusing 0-based indexing (Python) with 1-based indexing (R).',
      fix: 'Keep in mind that Python starts indexing lists and dataframes at index 0, whereas R vectors and matrices start at index 1.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Sử dụng vòng lặp (for/while) lồng nhau để xử lý từng dòng dữ liệu trong R hoặc Python.',
      fix: 'Hãy luôn tận dụng các phép toán Vector hóa (Vectorized operations). Các hàm xử lý trong numpy/pandas (Python) và dplyr (R) được tối ưu hóa ở tầng C/C++ cho tốc độ xử lý nhanh hơn hàng trăm lần.'
    },
    {
      mistake: 'Nhầm lẫn giữa lập chỉ mục bắt đầu từ số 0 (Python) và số 1 (R).',
      fix: 'Luôn chú ý rằng Python bắt đầu đánh chỉ số từ 0, trong khi R bắt đầu đếm phần tử trong vector hay ma trận từ 1.'
    }
  ];

  // Comparison Table
  const tableHeadersEn = ['Feature / Metric', 'R Language', 'Python (with Libraries)', 'Advantage / Winner'];
  const tableRowsEn = [
    ['Primary Domain', 'Academic statistics, clinical trials, econometrics', 'Machine learning, production pipelines, software engineering', 'Tie (Depends on Goal)'],
    ['Data Wrangling Syntax', 'dplyr / tidyverse (elegant, pipe-oriented)', 'pandas (powerful, method chaining, slightly verbose)', 'R (For readability)'],
    ['Visualization Library', 'ggplot2 (Grammar of Graphics, extremely customizable)', 'matplotlib & seaborn (highly functional, imperatively styled)', 'R (ggplot2 is superior)'],
    ['Machine Learning & AI', 'Available (caret, tidymodels), but less supported', 'Dominant (scikit-learn, PyTorch, TensorFlow, HuggingFace)', 'Python (Clear Winner)'],
    ['Execution Speed', 'Slow on large in-memory files; single-threaded', 'Faster, highly optimized C-extensions (NumPy, Polars)', 'Python (Polars/NumPy)']
  ];

  const tableHeadersVi = ['Tiêu chí so sánh', 'Ngôn ngữ R', 'Python (cùng các thư viện)', 'Lợi thế thuộc về'];
  const tableRowsVi = [
    ['Lĩnh vực trọng tâm', 'Thống kê học thuật, thử nghiệm lâm sàng, kinh tế lượng', 'Machine learning, hệ thống sản xuất, kỹ nghệ phần mềm', 'Hòa (Tùy mục tiêu)'],
    ['Cú pháp Xử lý Dữ liệu', 'Hệ sinh thái tidyverse/dplyr (thanh thoát, viết dạng đường ống)', 'Thư viện pandas (mạnh mẽ, xâu chuỗi phương thức, hơi dài dòng)', 'R (Dễ đọc & viết hơn)'],
    ['Đồ họa & Trực quan', 'ggplot2 (Triết lý Grammar of Graphics, tùy biến cao)', 'matplotlib & seaborn (tiện dụng, thiết kế hướng thủ tục)', 'R (ggplot2 vượt trội)'],
    ['Machine Learning & AI', 'Có hỗ trợ (caret, tidymodels) nhưng cộng đồng nhỏ hơn', 'Thống trị tuyệt đối (scikit-learn, PyTorch, TensorFlow, LLMs)', 'Python (Vượt trội)'],
    ['Tốc độ thực thi', 'Chậm khi xử lý dữ liệu lớn trên RAM; chạy đơn luồng', 'Nhanh hơn nhờ tối ưu hóa trên C (NumPy, Polars)', 'Python (Tối ưu phần cứng)']
  ];

  // Summary bullets
  const summaryEn = [
    'R is a specialized language built for statistics; it is excellent for classical regression, econometric models, and publication-ready charts.',
    'Python is a general programming language that dominates industrial data science, deep learning, and production system integration.',
    'Vectorization is the gold standard of writing code in both environments to avoid performance bottlenecks.',
    'Using tools like Jupyter and Quarto allows seamless blending of markdown documentation with live code blocks.'
  ];

  const summaryVi = [
    'R là ngôn ngữ chuyên biệt được viết bởi các nhà thống kê, cực kỳ mạnh về hồi quy cổ điển, kinh tế lượng và vẽ biểu đồ học thuật.',
    'Python là ngôn ngữ đa năng thống trị khoa học dữ liệu công nghiệp, học sâu và tích hợp mô hình vào phần mềm sản xuất.',
    'Vector hóa (Vectorization) là quy tắc vàng để tối ưu hiệu năng code trên cả hai ngôn ngữ, tránh nghẽn luồng xử lý dữ liệu.',
    'Các công cụ như Jupyter Notebook và Quarto hỗ trợ kết hợp hoàn hảo giữa viết tài liệu markdown và khối code thực thi thực tế.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="🐍" accentColor="#8b5cf6">
        <p>
          {isVi
            ? "Trong thế giới phân tích dữ liệu hiện đại, R và Python là hai công cụ ngôn ngữ quan trọng nhất. Mỗi ngôn ngữ mang một triết lý thiết kế hoàn toàn khác biệt, phục vụ những mục tiêu và đối tượng nghiên cứu riêng."
            : "In the modern data ecosystem, R and Python are the two absolute pillars of analysis programming. Each language carries a fundamentally different design philosophy, catering to distinct analytical goals and environments."}
        </p>
        <p>
          {isVi
            ? "R được thiết kế bởi các nhà thống kê dành cho các nhà thống kê. Do đó, cú pháp của nó hướng tới việc thực hiện các phân tích toán học một cách trực tiếp nhất. Ngược lại, Python là một ngôn ngữ lập trình hướng đối tượng đa mục đích. Nhờ thư viện Pandas và NumPy phát triển mạnh mẽ, Python đã nhanh chóng chiếm lĩnh thị phần khoa học dữ liệu ứng dụng."
            : "R was designed by statisticians, for statisticians. Consequently, its syntax is optimized to perform mathematical calculations and statistical testing out of the box. In contrast, Python is a general-purpose programming language. Supported by pandas, NumPy, and scikit-learn, Python became the industrial standard for production machine learning."}
        </p>
      </Section>

      {/* Importance & Use Cases */}
      <Section id="purpose" title={isVi ? "2. Vai trò & Ứng dụng Thực tế" : "2. Importance & Use Cases"} icon="🎯" accentColor="#8b5cf6">
        <p>
          {isVi
            ? "Hiểu rõ sự khác biệt giữa Python và R giúp nhà phân tích tiết kiệm hàng trăm giờ làm việc. R cực kỳ tối ưu cho các dự án nghiên cứu học thuật thuần túy, kinh tế lượng (Econometrics) và phân tích y sinh. Với thư viện ggplot2, R tạo ra những biểu đồ tinh tế, sẵn sàng cho việc in ấn báo chí khoa học."
            : "Understanding the difference between Python and R saves analysts hundreds of hours of trial-and-error. R excels in pure academic research, econometric modeling, and clinical trials. With ggplot2, R generates publication-grade visualizations with minimal formatting effort."}
        </p>
        <p>
          {isVi
            ? "Mặt khác, nếu dự án của bạn cần kết nối với hệ thống web, chạy trên nền tảng đám mây lớn hoặc xây dựng các mô hình Machine Learning / Deep Learning phức tạp thì Python là lựa chọn không thể thay thế. Thư viện statsmodels trong Python cung cấp đầy đủ các chỉ số hồi quy tương tự R, giúp thu hẹp khoảng cách giữa hai ngôn ngữ này."
            : "On the other hand, if your project needs to connect to an API database, run serverless on cloud platforms, or integrate with complex Deep Learning models, Python is irreplaceable. Libraries like statsmodels provide Python developers with detailed econometric regression tables equivalent to R outputs."}
        </p>
      </Section>

      {/* Technical Focus */}
      <Section id="math" title={isVi ? "3. Đặc tính Kỹ thuật & Cú pháp" : "3. Technical Focus & Syntax"} icon="💻" accentColor="#8b5cf6">
        <p>
          {isVi
            ? "Một đặc điểm kỹ thuật quan trọng của R là tính toán dạng Vector (Vectorized computing). Khi bạn cộng hai vector trong R, nó tự động cộng từng phần tử song song mà không cần viết vòng lặp. Python sử dụng thư viện NumPy (viết bằng C) để mô phỏng khả năng này dưới dạng các mảng đa chiều (ndarray)."
            : "A core technical feature of R is vectorized computing. When you add two vectors in R, it automatically performs element-wise addition in parallel without any loop syntax. Python utilizes NumPy (compiled in C) to emulate this exact capability through multidimensional arrays (ndarrays)."}
        </p>
        <InfoBox variant="tip">
          <strong className="block text-indigo-500 mb-1">
            {isVi ? "Tại sao cần Vector hóa thay vì Vòng lặp?" : "Why Vectorization beats Loops?"}
          </strong>
          <span>
            {isVi 
              ? "Vòng lặp trong Python/R chạy trên trình thông dịch (interpreter) dòng-sau-dòng nên cực kỳ chậm. Các hàm vector hóa đẩy các tác vụ tính toán xuống tầng mã máy compiled C/C++ trực tiếp trên RAM, tăng hiệu năng lên tới 100x - 1000x khi xử lý bảng dữ liệu hàng triệu dòng."
              : "Iterative loops in interpreted languages like Python and R run line-by-line, causing major CPU bottlenecks. Vectorized functions push arithmetic operations down to compiled C/C++ levels in memory, achieving 100x to 1000x speedups on massive datasets."}
          </span>
        </InfoBox>
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Bộ so sánh Cú pháp & Kết quả Chạy R vs Python" : "4. Interactive Code & Output Compare Simulator"} icon="🎮" accentColor="#8b5cf6">
        <p>
          {isVi
            ? "Dưới đây là công cụ trực quan hóa so sánh cú pháp lập trình giữa R và Python cho cùng các tác vụ phân tích. Hãy kéo thanh trượt điều chỉnh dữ liệu để xem sự tương tác thời gian thực."
            : "The interactive console below contrasts coding syntaxes and outputs between R and Python for identical tasks. Adjust the simulators sliders to observe how both environments react."}
        </p>
        <LanguagesVisualizer />
      </Section>

      {/* Steps */}
      <Section id="steps" title={isVi ? "5. Quy trình Triển khai Phân tích chuẩn" : "5. Standard Project Analytics Workflow"} icon="📋" accentColor="#8b5cf6">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Mistakes */}
      <Section id="mistakes" title={isVi ? "6. Sai lầm lập trình cần tránh" : "6. Common Anti-patterns to Avoid"} icon="❌" accentColor="#8b5cf6">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Comparison */}
      <Section id="comparison" title={isVi ? "7. Bảng So sánh Tính năng Chi tiết" : "7. R vs Python Feature Matrix"} icon="⚖️" accentColor="#8b5cf6">
        <p>
          {isVi
            ? "Ma trận so sánh dưới đây giúp bạn quyết định chính xác ngôn ngữ cần dùng cho dự án của mình."
            : "Use the comparative decision matrix below to select the right platform for your research requirements."}
        </p>
        <ComparisonTable
          headers={isVi ? tableHeadersVi : tableHeadersEn}
          rows={isVi ? tableRowsVi : tableRowsEn}
        />
      </Section>

      <SummaryCard bullets={isVi ? summaryVi : summaryEn} />
    </div>
  );
}
