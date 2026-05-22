import { useTranslation } from 'react-i18next';
import { Section, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import RegressionModelsVisualizer from './RegressionModelsVisualizer';

export default function RegressionModelsContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Steps
  const stepsEn = [
    { title: 'Define Variables', desc: 'Identify the independent variable (X, predictor) and dependent variable (Y, outcome) based on your hypothesis.' },
    { title: 'Collect & Scatter Plot', desc: 'Gather data points (X, Y) and plot them to inspect if the relationship looks linear or requires a curve.' },
    { title: 'Fit the Model', desc: 'Estimate coefficients (intercept β0 and slope β1) using Ordinary Least Squares (OLS) for Linear Regression, or Maximum Likelihood Estimation (MLE) for Logistic Regression.' },
    { title: 'Evaluate Fit Quality', desc: 'Check model goodness-of-fit metrics. Use R-squared (R2) for Linear Regression to see explained variance. Use Accuracy, Precision, Recall, or ROC-AUC for Logistic Regression.' },
    { title: 'Predict & Infer', desc: 'Use the fitted equation to predict outcomes for new observations, or interpret the slope to see how Y changes per unit change in X.' }
  ];

  const stepsVi = [
    { title: 'Xác định Biến số', desc: 'Xác định rõ biến độc lập (X, biến dự báo) và biến phụ thuộc (Y, kết quả đầu ra) dựa trên bài toán nghiên cứu.' },
    { title: 'Thu thập & Vẽ Biểu đồ phân tán', desc: 'Ghi nhận các điểm dữ liệu (X, Y) và vẽ biểu đồ scatter để quan sát trực quan xem mối quan hệ là tuyến tính hay phi tuyến.' },
    { title: 'Khớp Mô hình (Training)', desc: 'Ước lượng các tham số (hệ số chặn β0 và hệ số góc β1) sử dụng phương pháp Bình phương tối thiểu (OLS) cho Tuyến tính, hoặc Ước lượng hợp lý cực đại (MLE) cho Logistic.' },
    { title: 'Đánh giá độ khớp (Goodness-of-Fit)', desc: 'Tính toán các chỉ số đánh giá. Dùng R-squared (R2) cho Hồi quy tuyến tính để biết tỷ lệ phương sai được giải thích. Dùng Độ chính xác (Accuracy), F1-score hoặc ROC-AUC cho Logistic.' },
    { title: 'Dự báo & Suy diễn', desc: 'Sử dụng phương trình đã khớp để dự báo giá trị mới, hoặc diễn giải hệ số góc để biết Y thay đổi thế nào khi X tăng 1 đơn vị.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Extrapolating predictions far outside the range of observed training data.',
      fix: 'Only use regression models to predict within the data range (interpolation). Predictions outside the range (extrapolation) are highly unstable and unreliable.'
    },
    {
      mistake: 'Assuming a high R-squared score implies a causal relationship between X and Y.',
      fix: 'Remember that correlation does not equal causation. A regression model simply fits mathematical correlation; causal relationships require experimental controls.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Nội suy/Ngoại suy (Extrapolation) quá xa ngoài phạm vi dữ liệu quan sát ban đầu.',
      fix: 'Chỉ nên dùng mô hình để dự báo trong khoảng dữ liệu đã biết (nội suy). Ngoại suy ngoài khoảng dữ liệu huấn luyện rất thiếu ổn định và dễ gây sai số lớn.'
    },
    {
      mistake: 'Giả định rằng chỉ số R-squared cao đồng nghĩa với việc X có quan hệ nhân quả trực tiếp với Y.',
      fix: 'Nhớ kỹ rằng sự tương quan không đồng nghĩa với nhân quả. Mô hình hồi quy chỉ khớp các mô hình tương quan toán học; quan hệ nhân quả thực sự cần các thiết kế thực nghiệm chặt chẽ hơn.'
    }
  ];

  // Comparison Table
  const tableHeadersEn = ['Feature / Metric', 'Linear Regression', 'Logistic Regression'];
  const tableRowsEn = [
    ['Output Type', 'Continuous numerical values (e.g. salary, temperature)', 'Probability / Binary categories (e.g., Yes/No, Pass/Fail)'],
    ['Core Equation', 'y = β0 + β1 * x (straight line)', 'p = 1 / (1 + e^-(β0 + β1 * x)) (S-curve)'],
    ['Objective / Goal', 'Minimize sum of squared residuals (OLS)', 'Maximize likelihood of observed classes (Cross-Entropy Loss)'],
    ['Primary Evaluation Metric', 'R-squared (R2), Mean Squared Error (MSE)', 'Accuracy, F1-Score, Log-Loss, ROC-AUC']
  ];

  const tableHeadersVi = ['Đặc trưng / Chỉ số', 'Hồi quy Tuyến tính (Linear)', 'Hồi quy Logistic (Logistic)'];
  const tableRowsVi = [
    ['Kiểu dữ liệu đầu ra', 'Liên tục (ví dụ: tiền lương, nhiệt độ, chiều cao)', 'Xác suất / Phân loại nhị phân (ví dụ: Đậu/Rớt, Có/Không)'],
    ['Phương trình cốt lõi', 'y = β0 + β1 * x (Đường thẳng)', 'p = 1 / (1 + e^-(β0 + β1 * x)) (Đường cong chữ S - Sigmoid)'],
    ['Mục tiêu tối ưu', 'Tối thiểu hóa tổng bình phương sai số (OLS)', 'Tối đa hóa xác suất xảy ra của nhãn thực tế (Cross-Entropy Loss)'],
    ['Chỉ số đánh giá chính', 'R-squared (R2), Sai số bình phương trung bình (MSE)', 'Độ chính xác (Accuracy), F1-Score, ROC-AUC']
  ];

  // Summary bullets
  const summaryEn = [
    'Regression models describe the mathematical relationship between independent predictor variables and dependent outcomes.',
    'Linear Regression maps continuous targets and uses Ordinary Least Squares to find the line of best fit.',
    'Logistic Regression maps binary class probabilities using the Sigmoid activation function.',
    'R-squared measures the proportion of variance explained by the linear model, ranging from 0 to 1.'
  ];

  const summaryVi = [
    'Mô hình hồi quy mô tả mối liên hệ toán học giữa các biến độc lập dự báo và biến phụ thuộc đầu ra.',
    'Hồi quy tuyến tính áp dụng cho mục tiêu liên tục và sử dụng phương pháp Bình phương tối thiểu để tìm đường thẳng khớp nhất.',
    'Hồi quy Logistic dự báo xác suất của lớp nhị phân bằng cách áp dụng hàm kích hoạt Sigmoid hình chữ S.',
    'Chỉ số R-squared đo lường tỷ lệ phương sai của biến phụ thuộc được giải thích bởi mô hình, dao động từ 0 đến 1.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="📈" accentColor="#f43f5e">
        <p>
          {isVi
            ? "Trong thống kê và học máy, Mô hình Hồi quy (Regression Models) là công cụ toán học tối quan trọng dùng để định lượng hóa và dự báo mối quan hệ giữa các biến. Trong khi lấy mẫu giúp chúng ta thu thập dữ liệu đại diện, hồi quy giúp trích xuất tri thức từ dữ liệu đó để nhìn thấy các xu hướng tương lai."
            : "In statistics and machine learning, Regression Models are the ultimate mathematical framework used to quantify and forecast the relationships between variables. While sampling helps us collect representative data, regression extracts actionable knowledge from it to see future trends."}
        </p>
        <p>
          {isVi
            ? "Hai mô hình phổ biến và là nền tảng của mọi phân tích dữ liệu là Hồi quy tuyến tính (Linear Regression) - dùng cho các biến đầu ra liên tục, và Hồi quy Logistic (Logistic Regression) - dùng để phân loại sự kiện nhị phân (chẳng hạn xảy ra hoặc không xảy ra)."
            : "The two most ubiquitous models serving as the foundation of data analysis are Linear Regression (for continuous numerical targets) and Logistic Regression (for predicting the probability of binary categorical events)."}
        </p>
      </Section>

      {/* Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍" accentColor="#f43f5e">
        <p>
          {isVi
            ? "Tại sao hồi quy lại quan trọng? Giả sử bạn muốn biết chi phí quảng cáo tác động như thế nào đến doanh thu. Hồi quy tuyến tính sẽ cho bạn một công thức cụ thể: Doanh thu = β0 + β1 * Quảng cáo. Hệ số β1 cho biết mỗi triệu đồng quảng cáo tăng thêm sẽ đem lại bao nhiêu doanh thu."
            : "Why is regression so crucial? Suppose you want to know how advertising budget impacts revenue. Linear regression outputs a concrete equation: Revenue = β0 + β1 * Ads. The coefficient β1 tells you exactly how much revenue increases per extra unit spent on ads."}
        </p>
        <p>
          {isVi
            ? "Hoặc nếu bạn muốn dự đoán khả năng một khách hàng sẽ rời bỏ dịch vụ (churn) dựa trên số lần họ gặp sự cố kỹ thuật. Hồi quy Logistic sẽ tính toán xác suất từ 0% đến 100%, cho phép doanh nghiệp chủ động chăm sóc nhóm khách hàng có nguy cơ rời bỏ cao."
            : "Or, if you want to predict the probability of a customer cancelling their subscription (churn) based on technical issues logged. Logistic Regression computes a probability from 0% to 100%, allowing businesses to proactively offer support to high-risk accounts."}
        </p>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Thống kê" : "3. Mathematical Formulas"} icon="➗" accentColor="#f43f5e">
        <p>
          {isVi
            ? "Dưới đây là các phương trình cốt lõi của hai mô hình hồi quy nền tảng."
            : "Here are the mathematical foundations behind the two core regression models."}
        </p>

        {/* Formula 1: Linear Regression */}
        <FormulaCard
          title={isVi ? "1. Phương trình Hồi quy Tuyến tính Đơn giản (Simple Linear Regression)" : "1. Simple Linear Regression Equation"}
          formula="y = \beta_0 + \beta_1 x + \epsilon"
          variables={[
            { name: 'y', desc: isVi ? 'Biến phụ thuộc đầu ra (biến liên tục)' : 'Dependent variable (continuous target)' },
            { name: 'x', desc: isVi ? 'Biến độc lập đầu vào (biến dự báo)' : 'Independent variable (predictor)' },
            { name: '\\beta_0', desc: isVi ? 'Hệ số chặn (Intercept, giá trị của y khi x = 0)' : 'Intercept (value of y when x is 0)' },
            { name: '\\beta_1', desc: isVi ? 'Hệ số góc (Slope, độ thay đổi của y khi x tăng 1 đơn vị)' : 'Slope coefficient (change in y per unit change in x)' },
            { name: '\\epsilon', desc: isVi ? 'Sai số ngẫu nhiên (Residual/Error term)' : 'Random error term' }
          ]}
        />

        {/* Formula 2: Logistic Regression Sigmoid */}
        <FormulaCard
          title={isVi ? "2. Hàm Sigmoid trong Hồi quy Logistic (Sigmoid Activation function)" : "2. Logistic Regression Sigmoid Function"}
          formula="P(Y=1|x) = p(x) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x)}}"
          variables={[
            { name: 'p(x)', desc: isVi ? 'Xác suất để sự kiện Y = 1 xảy ra khi biết giá trị đầu vào x (nằm trong đoạn [0, 1])' : 'Probability that the target Y is 1 given input x (bounded between 0 and 1)' },
            { name: 'e', desc: isVi ? 'Hằng số Euler (khoảng 2.71828)' : 'Euler\'s constant (~2.71828)' },
            { name: '\\beta_0 + \\beta_1 x', desc: isVi ? 'Mô hình tuyến tính log-odds của xác suất' : 'Linear combination (log-odds representation)' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Bộ mô phỏng Hồi quy Tương tác" : "4. Interactive Regression Simulator"} icon="🎮" accentColor="#f43f5e">
        <p>
          {isVi
            ? "Mô phỏng dưới đây cho phép bạn tự thiết lập các điểm dữ liệu (bằng cách nhấn chuột trực tiếp lên biểu đồ để thêm điểm). Chọn chế độ hồi quy Tuyến tính hoặc Logistic để xem các thuật toán khớp đường xu hướng và tính toán hệ số trong thời gian thực."
            : "Use the interactive graph below to manually place data points by clicking directly on the canvas. Toggle between Linear and Logistic modes to visualize how regression lines/curves adapt and calculate score metrics in real-time."}
        </p>
        <RegressionModelsVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình xây dựng Mô hình Hồi quy" : "5. Step-by-Step Regression Modeling Guide"} icon="📋" accentColor="#f43f5e">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Pitfalls */}
      <Section id="mistakes" title={isVi ? "6. Sai lầm phổ biến cần tránh" : "6. Common Pitfalls to Avoid"} icon="❌" accentColor="#f43f5e">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Comparison Table */}
      <Section id="comparison" title={isVi ? "7. So sánh Tuyến tính vs Logistic" : "7. Linear vs Logistic Regression Comparison Matrix"} icon="📊" accentColor="#f43f5e">
        <ComparisonTable
          headers={isVi ? tableHeadersVi : tableHeadersEn}
          rows={isVi ? tableRowsVi : tableRowsEn}
        />
      </Section>

      {/* Summary */}
      <SummaryCard bullets={isVi ? summaryVi : summaryEn} />
    </div>
  );
}
