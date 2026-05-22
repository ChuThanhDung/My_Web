import { useTranslation } from 'react-i18next';
import { Section, ComparisonTable, CommonMistakes, SummaryCard, StepGuide, FormulaCard } from '../sampling/SamplingSharedComponents';
import ClassicalSoftwareVisualizer from './ClassicalSoftwareVisualizer';

export default function ClassicalSoftwareContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Steps
  const stepsEn = [
    { title: 'Data Format Inspection', desc: 'Import dataset into the software. Ensure correct metadata typing: SPSS uses Nominal/Ordinal/Scale; Stata uses byte/int/long/float/double.' },
    { title: 'Unit Root Stationarity Verification', desc: 'In EViews, plot raw economic series. Run the Augmented Dickey-Fuller (ADF) test. If non-stationary, apply 1st-difference transformation.' },
    { title: 'Command-Line / GUI Setup', desc: 'Configure dialog fields (SPSS Dependent and Fixed factors) or write clean cmd files (Stata .do scripts) to establish a repeatable analysis trail.' },
    { title: 'Model Estimation & Fit Analysis', desc: 'Run the ANOVA or OLS commands. Inspect the F-statistic, R-squared values, and check p-values for statistical significance.' },
    { title: 'Diagnostics & Reporting', desc: 'Evaluate residuals normality, homoscedasticity, and export structured output tables directly into academic journals.' }
  ];

  const stepsVi = [
    { title: 'Định dạng & Kiểm tra Kiểu Dữ liệu', desc: 'Nhập tệp dữ liệu vào phần mềm. Cấu hình chính xác kiểu dữ liệu cột: SPSS chia thành Nominal/Ordinal/Scale; Stata dùng byte/int/long/float/double.' },
    { title: 'Kiểm định Dãy Dừng (Stationarity)', desc: 'Trong EViews, vẽ biểu đồ chuỗi thời gian. Chạy kiểm định ADF. Nếu dãy không dừng (chứa unit root), thực hiện lấy sai phân bậc 1.' },
    { title: 'Cấu hình Hộp thoại hoặc Viết Lệnh', desc: 'Thiết lập các thông số trong bảng chọn (SPSS) hoặc viết tệp lệnh lưu vết (tệp .do của Stata) để phân tích có thể tái lập.' },
    { title: 'Thực thi Ước lượng Mô hình', desc: 'Chạy phân tích ANOVA hoặc Hồi quy tuyến tính. Đọc kỹ giá trị kiểm định F-statistic, hệ số R-squared và p-value để đánh giá ý nghĩa.' },
    { title: 'Chẩn đoán sau ước lượng & Kết xuất', desc: 'Kiểm tra phân phối phần dư, phương sai thay đổi và sao chép trực tiếp bảng kết quả chuẩn hóa vào tài liệu báo cáo nghiên cứu.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Running regressions on non-stationary macroeconomic time series.',
      fix: 'This causes "spurious regression" where R-squared appears high but variables are completely unrelated. Always test for unit roots (ADF test) and difference the series if necessary.'
    },
    {
      mistake: 'Treating nominal/categorical factors as scale variables in SPSS ANOVA.',
      fix: 'Always double-check Variable View in SPSS. Categorical predictors must be specified under Fixed Factors, not Covariates.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Chạy mô hình hồi quy trên chuỗi thời gian vĩ mô không dừng (Non-stationary).',
      fix: 'Hiện tượng này gây ra "Hồi quy giả mạo" (Spurious Regression) làm chỉ số R-squared rất cao nhưng các biến thực tế không có liên hệ. Luôn chạy kiểm định nghiệm đơn vị (ADF test) và lấy sai phân để đưa chuỗi về dạng dừng.'
    },
    {
      mistake: 'Coi các biến phân loại định tính là biến định lượng liên tục trong SPSS ANOVA.',
      fix: 'Hãy kiểm tra lại Variable View. Các biến phân loại độc lập phải được đưa vào ô Fixed Factors chứ không phải ô Covariates.'
    }
  ];

  // Comparison Table
  const tableHeadersEn = ['Feature / Tool', 'IBM SPSS Statistics', 'Stata', 'EViews'];
  const tableRowsEn = [
    ['Primary User Group', 'Market researchers, sociology academics, medical labs', 'Microeconomists, labor economists, epidemiologists', 'Macroeconomists, financial analysts, central banks'],
    ['User Interface (UI)', 'Point-and-click menu GUI with spreadsheet data view', 'Fast command-line terminal with scripting (.do files)', 'Object-oriented menu + time-series database sheets'],
    ['Key Strengths', 'Simple user interface; no programming experience required', 'Extremely rich panel data (Panel) and survey design models', 'Advanced econometrics: ARIMA, GARCH, vector autoregressions'],
    ['Reproducibility', 'Poor (unless syntax logs are saved)', 'Excellent (using command history and .do files)', 'Medium (uses workfiles, commands can be saved)'],
    ['Open Source / Cost', 'Proprietary; expensive institutional licensing required', 'Proprietary; license required based on core counts', 'Proprietary; license required']
  ];

  const tableHeadersVi = ['Tiêu chí / Công cụ', 'IBM SPSS Statistics', 'Stata', 'EViews'];
  const tableRowsVi = [
    ['Đối tượng chính', 'Nhà nghiên cứu thị trường, xã hội học, y sinh học', 'Nhà kinh tế học vi mô, kinh tế lao động, dịch tễ học', 'Nhà kinh tế học vĩ mô, chuyên viên tài chính, ngân hàng'],
    ['Phương thức Giao tiếp', 'Giao diện đồ họa click chuột, quản lý bảng tính như Excel', 'Dòng lệnh terminal kết hợp viết kịch bản tệp tin lệnh (.do)', 'Quản lý đối tượng (workfile), chuyên chuỗi thời gian'],
    ['Thế mạnh cốt lõi', 'Dễ sử dụng, trực quan, không cần tư duy lập trình phức tạp', 'Phân tích dữ liệu bảng (Panel data), hồi quy điều trị y tế', 'Mô hình kinh tế lượng chuỗi thời gian: ARIMA, GARCH, VAR'],
    ['Khả năng Tái lập', 'Thấp (trừ khi lưu lại lịch sử cú pháp lệnh)', 'Rất cao (thông qua viết kịch bản dòng lệnh chặt chẽ)', 'Trung bình (quản lý theo workfile, có thể lưu lịch sử lệnh)'],
    ['Bản quyền / Chi phí', 'Độc quyền thương mại; chi phí bản quyền tổ chức rất cao', 'Độc quyền thương mại; phân chia bản quyền theo nhân CPU', 'Độc quyền thương mại; chi phí bản quyền cao']
  ];

  // Summary bullets
  const summaryEn = [
    'SPSS is the go-to software for fast point-and-click statistical analysis, popular in market research.',
    'Stata is highly optimized for microeconomic panel data using command scripts (.do files) that ensure perfect study reproducibility.',
    'EViews is custom-tailored for econometric time-series analysis and stationarity diagnostics (ADF tests).',
    'While programming languages (R/Python) are growing fast, legacy industries and economic journals still mandate these classical tools.'
  ];

  const summaryVi = [
    'SPSS là lựa chọn hàng đầu cho các phân tích kéo-thả trực quan nhanh chóng, dùng nhiều trong khảo sát thị trường.',
    'Stata tối ưu vượt trội cho dữ liệu bảng kinh tế vi mô nhờ hệ lệnh ngắn gọn và khả năng lưu tệp kịch bản (.do) giúp tái lập nghiên cứu.',
    'EViews chuyên trị dữ liệu chuỗi thời gian vĩ mô, tài chính và kiểm định tính dừng (kiểm định ADF).',
    'Mặc dù Python/R đang phát triển, các viện nghiên cứu kinh tế và tạp chí học thuật lớn vẫn tin dùng hệ sinh thái cổ điển này.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="🎛️" accentColor="#6366f1">
        <p>
          {isVi
            ? "Trước khi R và Python bùng nổ, ba phần mềm thống kê cổ điển gồm SPSS, Stata và EViews chính là xương sống của mọi nghiên cứu dữ liệu định lượng. Khác với các thư viện code mở, các phần mềm này được đóng gói thương mại với độ ổn định, tính nhất quán cực kỳ cao và được tối ưu hóa sâu sắc cho từng chuyên ngành kinh tế - xã hội."
            : "Before R and Python entered the mainstream, three classic statistical programs—SPSS, Stata, and EViews—formed the backbone of quantitative analysis. Unlike open-source code libraries, these proprietary applications are strictly validated, highly stable, and optimized for specific economic and sociological fields."}
        </p>
        <p>
          {isVi
            ? "SPSS nổi bật với triết lý kéo-thả (GUI), giúp các nhà nghiên cứu thị trường không cần biết lập trình vẫn chạy được kiểm định ANOVA hay nhân tố khám phá EFA. Stata hoạt động chủ yếu qua dòng lệnh ngắn gọn, là tiêu chuẩn trong phân tích chính sách và dữ liệu bảng. EViews lại được thiết kế tối ưu cho chuỗi dữ liệu thời gian vĩ mô của các ngân hàng trung ương và quỹ đầu tư tài chính."
            : "SPSS is renowned for its point-and-click GUI, enabling researchers to run ANOVA or Exploratory Factor Analysis (EFA) without writing code. Stata runs via highly concise command lines, representing the academic standard for policy evaluation and panel data. EViews is tailored specifically for macroeconomists and central banks analyzing time-series datasets."}
        </p>
      </Section>

      {/* Importance & Use Cases */}
      <Section id="purpose" title={isVi ? "2. Vai trò & Lĩnh vực Phân phối" : "2. Importance & Use Cases"} icon="🏛️" accentColor="#6366f1">
        <p>
          {isVi
            ? "Mặc dù Python và R rất mạnh mẽ, việc làm quen với các công cụ này là bắt buộc nếu bạn làm việc trong các tổ chức tài chính lớn, cơ quan nhà nước, nghiên cứu y tế hay giảng dạy đại học kinh tế. SPSS giúp xử lý khảo sát người tiêu dùng cực nhanh. Stata đảm bảo tính tái lập (reproducibility) cao thông qua các file kịch bản lệnh .do. EViews giúp dự báo các chỉ số lạm phát, GDP hay giá chứng khoán một cách chuyên nghiệp."
            : "While Python and R are highly flexible, familiarity with classical software is mandatory for careers in commercial banking, governmental agencies, medical institutions, or economic academia. SPSS executes consumer surveys in minutes. Stata guarantees reproducible papers through executable .do files. EViews offers specialized tools to forecast inflation, GDP, or stock prices."}
        </p>
      </Section>

      {/* Technical Focus */}
      <Section id="math" title={isVi ? "3. Cơ sở Toán học & Thuật toán Kiểm định" : "3. Mathematical Foundations & Tests"} icon="📐" accentColor="#6366f1">
        <p>
          {isVi
            ? "Một kiểm định vô cùng phổ biến trong EViews là Kiểm định Nghiệm đơn vị (ADF test) dùng để xác định tính dừng của chuỗi thời gian - điều kiện tiên quyết để mô hình không bị sai lệch."
            : "A prominent statistical procedure in EViews is the Augmented Dickey-Fuller (ADF) Unit Root test. Stationarity is a strict prerequisite for any time-series regression to prevent biased estimates."}
        </p>

        {/* Formula 1: ADF Equation */}
        <FormulaCard
          title={isVi ? "Phương trình kiểm định nghiệm đơn vị ADF (Augmented Dickey-Fuller)" : "ADF Regression Equation"}
          formula="\Delta y_t = \alpha + \beta t + \gamma y_{t-1} + \sum_{i=1}^{p} \delta_i \Delta y_{t-i} + \epsilon_t"
          variables={[
            { name: '\\Delta y_t', desc: isVi ? 'Sai phân bậc 1 của chuỗi thời gian tại thời điểm t (y_t - y_{t-1})' : 'First difference of the time series at time t' },
            { name: '\\gamma', desc: isVi ? 'Hệ số kiểm định nghiệm đơn vị (Nếu H0: \\gamma = 0, chuỗi có unit root - không dừng)' : 'Coefficient of interest (If gamma = 0, unit root exists)' },
            { name: '\\sum \\delta_i \\Delta y_{t-i}', desc: isVi ? 'Các biến sai phân trễ để triệt tiêu hiện tượng tự tương quan phần dư' : 'Lagged differences to eliminate residual autocorrelation' },
            { name: '\\epsilon_t', desc: isVi ? 'Sai số ngẫu nhiên nhiễu trắng (White noise error term)' : 'White noise error term' }
          ]}
        />

        {/* Formula 2: ANOVA F-statistic */}
        <FormulaCard
          title={isVi ? "Tỷ lệ kiểm định F-statistic trong phân tích ANOVA (SPSS)" : "ANOVA F-Statistic Ratio"}
          formula="F = \frac{MS_{Between}}{MS_{Within}} = \frac{SS_{Between} / (k - 1)}{SS_{Within} / (n - k)}"
          variables={[
            { name: 'MS_{Between}', desc: isVi ? 'Phương sai trung bình giữa các nhóm (biến động do yếu tố tác động)' : 'Mean square variance between groups' },
            { name: 'MS_{Within}', desc: isVi ? 'Phương sai trung bình trong nội bộ nhóm (biến động do ngẫu nhiên)' : 'Mean square variance within groups (error)' },
            { name: 'k', desc: isVi ? 'Số lượng nhóm phân loại độc lập' : 'Number of treatment groups' },
            { name: 'n', desc: isVi ? 'Tổng số lượng quan sát mẫu' : 'Total number of sample observations' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Bộ mô phỏng Giao diện & Kết quả SPSS, Stata, EViews" : "4. Interactive GUI & Console Simulators"} icon="🎮" accentColor="#6366f1">
        <p>
          {isVi
            ? "Hãy lựa chọn thẻ công cụ bên dưới để trải nghiệm cách vận hành thực tế của từng ứng dụng phần mềm cổ điển."
            : "Select the software tabs below to test the direct interfaces and analysis steps of each classic tool."}
        </p>
        <ClassicalSoftwareVisualizer />
      </Section>

      {/* Steps */}
      <Section id="steps" title={isVi ? "5. Quy trình Phân tích Thống kê Cổ điển" : "5. Legacy Statistical Workflow"} icon="📋" accentColor="#6366f1">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Mistakes */}
      <Section id="mistakes" title={isVi ? "6. Sai lầm phân tích cần tránh" : "6. Common Legacy Pitfalls"} icon="❌" accentColor="#6366f1">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Comparison */}
      <Section id="comparison" title={isVi ? "7. Ma trận Phân biệt SPSS, Stata & EViews" : "7. SPSS vs Stata vs EViews Feature Matrix"} icon="⚖️" accentColor="#6366f1">
        <p>
          {isVi
            ? "Bảng so sánh dưới đây phân tích các đặc trưng phần mềm giúp bạn đưa ra lựa chọn đầu tư phần mềm tối ưu."
            : "The matrix below isolates the unique software capabilities to help guide tool licensing decisions."}
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
