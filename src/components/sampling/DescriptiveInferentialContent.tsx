import { useTranslation } from 'react-i18next';
import { Section, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import DescriptiveInferentialVisualizer from './DescriptiveInferentialVisualizer';

export default function DescriptiveInferentialContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Steps
  const stepsEn = [
    { title: 'State the Hypotheses', desc: 'Define the Null Hypothesis (H0: no difference or effect) and the Alternative Hypothesis (H1: there is a significant difference).' },
    { title: 'Determine the Significance Level (α)', desc: 'Choose a threshold for rejecting H0, typically set to α = 0.05 (5% risk of false positive).' },
    { title: 'Collect & Prepare Data', desc: 'Gather representative sample data from groups, clean the dataset, and calculate basic descriptive stats (Mean, Variance, SD).' },
    { title: 'Execute the Statistical Test', desc: 'Select the test based on data type (e.g., t-test for comparing two means, ANOVA for three or more, Chi-Square for categorical counts) and calculate the test statistic.' },
    { title: 'Evaluate P-value & Draw Conclusion', desc: 'Compare the p-value against α. If p <= α, reject the null hypothesis, indicating statistical significance. Otherwise, fail to reject.' }
  ];

  const stepsVi = [
    { title: 'Phát biểu Giả thuyết Khoa học', desc: 'Định nghĩa Giả thuyết Không (H0: không có sự khác biệt hoặc hiệu ứng) và Giả thuyết Đối (H1: có sự khác biệt có ý nghĩa thống kê).' },
    { title: 'Xác định Mức Ý nghĩa (α)', desc: 'Chọn ngưỡng quyết định để bác bỏ H0, thông thường được chọn ở mức α = 0.05 (chấp nhận 5% rủi ro dương tính giả).' },
    { title: 'Thu thập & Xử lý Dữ liệu', desc: 'Thu thập dữ liệu mẫu đại diện của các nhóm, làm sạch dữ liệu và tính toán các chỉ số mô tả cơ bản (Trung bình, Phương sai, Độ lệch chuẩn).' },
    { title: 'Lựa chọn & Thực thi Kiểm định', desc: 'Chọn kiểm định phù hợp (t-test so sánh 2 trung bình, ANOVA cho 3 nhóm trở lên, Chi-Square cho dữ liệu định tính) để tính toán giá trị kiểm định.' },
    { title: 'Đánh giá P-value & Kết luận', desc: 'So sánh p-value với mức ý nghĩa α. Nếu p <= α, bác bỏ H0 để chấp nhận H1 (có ý nghĩa thống kê). Ngược lại, chưa đủ cơ sở bác bỏ H0.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Interpreting a high p-value as proof that the Null Hypothesis is true.',
      fix: 'Remember that "failing to reject H0" does not prove H0 is true; it simply means we lack sufficient evidence to support H1 at the current sample size.'
    },
    {
      mistake: 'Confusing statistical significance with practical significance.',
      fix: 'With extremely large sample sizes, even tiny, meaningless differences can produce a p-value < 0.05. Always evaluate effect sizes (e.g., Cohen\'s d) alongside p-values.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Coi P-value lớn là bằng chứng chứng minh Giả thuyết Không (H0) hoàn toàn đúng.',
      fix: 'Ghi nhớ rằng "chưa bác bỏ H0" không có nghĩa là chứng minh H0 đúng; nó chỉ mang ý nghĩa là chúng ta chưa có đủ bằng chứng thực nghiệm để chứng minh H1 ở quy mô mẫu hiện tại.'
    },
    {
      mistake: 'Nhầm lẫn giữa Ý nghĩa Thống kê (Statistical Significance) và Ý nghĩa Thực tiễn (Practical Significance).',
      fix: 'Khi kích thước mẫu cực kỳ lớn, ngay cả những khác biệt nhỏ nhất và không có giá trị thực tế cũng có thể cho ra p-value < 0.05. Hãy luôn đánh giá kích thước hiệu ứng (Effect Size, ví dụ: Cohen\'s d) song song với p-value.'
    }
  ];

  // Comparison Table
  const tableHeadersEn = ['Statistical Test', 'Ideal For', 'Variables Type', 'Example Scenario'];
  const tableRowsEn = [
    ['t-test (Independent / Paired)', 'Comparing means between 2 groups or conditions', '1 Categorical (2 levels), 1 Continuous', 'Testing if Website design A yields a higher average session duration than design B.'],
    ['ANOVA (Analysis of Variance)', 'Comparing means across 3 or more groups', '1 Categorical (3+ levels), 1 Continuous', 'Comparing the average exam score of students using 3 different study techniques.'],
    ['Chi-Square Test of Independence', 'Testing association between categorical variables', '2 Categorical variables', 'Testing if customer satisfaction category (High/Low) is related to their subscription tier.']
  ];

  const tableHeadersVi = ['Kiểm định Thống kê', 'Ứng dụng chính', 'Loại biến số', 'Ví dụ Thực tế'];
  const tableRowsVi = [
    ['Kiểm định t-test', 'So sánh giá trị trung bình giữa 2 nhóm độc lập hoặc lặp lại', '1 biến Định tính (2 nhóm), 1 biến Định lượng', 'Kiểm tra xem giao diện web A có giữ chân người dùng lâu hơn giao diện B hay không.'],
    ['ANOVA (Phân tích phương sai)', 'So sánh giá trị trung bình giữa 3 nhóm trở lên', '1 biến Định tính (>= 3 nhóm), 1 biến Định lượng', 'So sánh điểm thi trung bình của học sinh áp dụng 3 phương pháp ôn tập khác nhau.'],
    ['Kiểm định Chi-Square (Khi bình phương)', 'Kiểm tra mối liên hệ giữa các nhóm phân loại', '2 biến Định tính', 'Kiểm tra xem tỷ lệ hài lòng của khách hàng (Thấp/Cao) có liên quan đến gói cước đăng ký hay không.']
  ];

  // Summary bullets
  const summaryEn = [
    'Descriptive statistics summarize the sample data characteristics (Mean, Variance, SD).',
    'Inferential statistics let you draw conclusions about the population from the sample data.',
    'Hypothesis testing (t-test, ANOVA) relies on calculating probability values (p-value) to control for random chance errors.',
    'The significance level (α) defines the threshold of acceptable false positive rate (usually 5%).'
  ];

  const summaryVi = [
    'Thống kê mô tả tóm tắt các đặc trưng của dữ liệu mẫu hiện tại (Trung bình, Phương sai, Độ lệch chuẩn).',
    'Thống kê suy luận cho phép rút ra kết luận khái quát hóa về toàn quần thể từ dữ liệu mẫu.',
    'Kiểm định giả thuyết (t-test, ANOVA) dựa trên tính toán xác suất (p-value) để kiểm soát sai sót ngẫu nhiên.',
    'Mức ý nghĩa (α) xác định ngưỡng rủi ro chấp nhận được đối với kết quả dương tính giả (thông thường là 5%).'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="📊" accentColor="#ec4899">
        <p>
          {isVi
            ? "Mọi nghiên cứu dữ liệu khoa học đều bao gồm hai giai đoạn chính để đọc vị các con số: Thống kê Mô tả (Descriptive Statistics) và Thống kê Suy luận (Inferential Statistics). Đây là chiếc cầu nối cốt lõi đi từ dữ liệu quan sát thô đến việc ra các quyết định có độ tin cậy khoa học cao."
            : "All scientific data analysis involves two main pillars to read numbers: Descriptive Statistics and Inferential Statistics. This serves as the absolute bridge connecting raw observational data to reliable, evidence-based business decisions."}
        </p>
        <p>
          {isVi
            ? "Thống kê mô tả mô tả ngắn gọn bộ dữ liệu hiện tại thông qua các chỉ số tập trung và phân tán. Thống kê suy luận tiến thêm một bước: sử dụng toán học xác suất để kiểm định xem sự khác biệt quan sát được từ dữ liệu mẫu là thực tế, hay chỉ là do biến động ngẫu nhiên (may rủi) trong quá trình lấy mẫu."
            : "Descriptive statistics summarize the observed sample dataset through measures of central tendency and dispersion. Inferential statistics take it further: using probability theory to test whether differences observed in our sample represent a true phenomenon or are simply due to random sampling variations (mere noise)."}
        </p>
      </Section>

      {/* Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍" accentColor="#ec4899">
        <p>
          {isVi
            ? "Hãy tưởng tượng bạn đang chạy thử nghiệm A/B cho một sản phẩm. Giao diện A có tỷ lệ click 12%, trong khi giao diện B có tỷ lệ click 15%. Sự chênh lệch 3% này có thực sự chứng minh thiết kế B tốt hơn? Hay đó chỉ là một sự trùng hợp ngẫu nhiên do hôm nay tập người dùng thử nghiệm của nhóm B tình cờ vui vẻ hơn?"
            : "Imagine you are running an A/B test for a product. Interface A yields a 12% click-through rate, while Interface B yields 15%. Does this 3% difference prove that design B is better? Or was it just a random coincidence because the sample group tested on B happened to be more active today?"}
        </p>
        <p>
          {isVi
            ? "Kiểm định giả thuyết (Hypothesis Testing) ra đời để giải quyết bài toán đó. Bằng cách tính toán các chỉ số mẫu và áp dụng kiểm định như t-test, ANOVA hoặc Chi-square, bạn có thể đưa ra kết luận với mức độ tin cậy xác định trước (ví dụ: tin cậy 95%), giảm tối đa sai sót quyết định."
            : "Hypothesis testing solves this precise uncertainty. By computing statistical metrics and running tests like t-tests, ANOVA, or Chi-square, you make product decisions with a specified level of confidence (e.g., 95% confidence level), minimizing costly decision mistakes."}
        </p>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Thống kê" : "3. Mathematical Formulas"} icon="➗" accentColor="#ec4899">
        <p>
          {isVi
            ? "Dưới đây là các công thức thống kê cơ bản và phương pháp tính toán giá trị t-test độc lập giữa 2 nhóm để so sánh trung bình."
            : "Below are the baseline statistical formulas and the formula for calculating an Independent Two-Sample t-test."}
        </p>

        {/* Formula 1: Mean */}
        <FormulaCard
          title={isVi ? "1. Giá trị Trung bình Mẫu (Sample Mean)" : "1. Sample Mean"}
          formula="\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i"
          variables={[
            { name: '\\bar{x}', desc: isVi ? 'Giá trị trung bình mẫu' : 'Sample mean' },
            { name: 'x_i', desc: isVi ? 'Giá trị của quan sát thứ i' : 'Value of the i-th observation' },
            { name: 'n', desc: isVi ? 'Kích thước mẫu (số lượng quan sát)' : 'Sample size' }
          ]}
        />

        {/* Formula 2: Standard Deviation */}
        <FormulaCard
          title={isVi ? "2. Độ lệch chuẩn mẫu hiệu chỉnh (Sample Standard Deviation)" : "2. Corrected Sample Standard Deviation"}
          formula="s = \sqrt{\frac{1}{n-1} \sum_{i=1}^{n} (x_i - \bar{x})^2}"
          variables={[
            { name: 's', desc: isVi ? 'Độ lệch chuẩn mẫu hiệu chỉnh' : 'Sample standard deviation' },
            { name: 's^2', desc: isVi ? 'Phương sai mẫu hiệu chỉnh (mẫu số n-1 giúp ước lượng không chệch phương sai quần thể)' : 'Sample variance' },
            { name: '\\bar{x}', desc: isVi ? 'Trung bình mẫu' : 'Sample mean' }
          ]}
        />

        {/* Formula 3: Two-sample T-test statistic */}
        <FormulaCard
          title={isVi ? "3. Giá trị thống kê t-test cho 2 nhóm độc lập (Welch's t-test)" : "3. Welch's Independent t-test Statistic"}
          formula="t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}"
          variables={[
            { name: 't', desc: isVi ? 'Giá trị thống kê t (dùng để tra cứu p-value từ phân phối Student)' : 'Calculated t-statistic' },
            { name: '\\bar{x}_1, \\bar{x}_2', desc: isVi ? 'Trung bình mẫu của Nhóm 1 và Nhóm 2' : 'Means of Group 1 and Group 2' },
            { name: 's_1, s_2', desc: isVi ? 'Độ lệch chuẩn mẫu của Nhóm 1 và Nhóm 2' : 'Standard deviations of Group 1 and Group 2' },
            { name: 'n_1, n_2', desc: isVi ? 'Cỡ mẫu tương ứng của 2 nhóm' : 'Sample sizes of the two groups' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Bộ mô phỏng Kiểm định Giả thuyết" : "4. Interactive Hypothesis Testing Simulator"} icon="🎮" accentColor="#ec4899">
        <p>
          {isVi
            ? "Mô phỏng dưới đây tạo lập ngẫu nhiên 2 nhóm dữ liệu A và B. Bạn có thể thay đổi Trung bình và Độ lệch chuẩn thực tế của quần thể để xem T-test tính toán các giá trị thống kê và biểu diễn vùng phân phối xác suất như thế nào."
            : "The simulator below generates random sample data for Group A and Group B. Adjust the true population means and standard deviations to see how the t-test computes values and charts the probability density curves in real time."}
        </p>
        <DescriptiveInferentialVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình Kiểm định Giả thuyết chuẩn" : "5. Standard Hypothesis Testing Workflow"} icon="📋" accentColor="#ec4899">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Pitfalls */}
      <Section id="mistakes" title={isVi ? "6. Sai lầm phổ biến cần tránh" : "6. Common Pitfalls to Avoid"} icon="❌" accentColor="#ec4899">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Comparison Table */}
      <Section id="comparison" title={isVi ? "7. Ma trận Lựa chọn Kiểm định Thống kê" : "7. Statistical Test Selection Matrix"} icon="📊" accentColor="#ec4899">
        <p>
          {isVi
            ? "Lựa chọn sai kiểm định sẽ dẫn đến kết luận sai lệch nghiêm trọng. Bảng dưới đây tóm tắt cách lựa chọn phương pháp dựa trên dữ liệu nghiên cứu."
            : "Selecting the wrong test leads to completely invalid conclusions. Use the guide below to match your variable structure with the correct method."}
        </p>
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
