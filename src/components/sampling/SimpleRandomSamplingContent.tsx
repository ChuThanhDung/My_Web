import { useTranslation } from 'react-i18next';
import { Section, InfoBox, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import SimpleRandomVisualizer from './SimpleRandomVisualizer';
import { BlockMath } from 'react-katex';

export default function SimpleRandomSamplingContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Define steps
  const stepsEn = [
    { title: 'Define the Population', desc: 'Identify the entire target population (N) that you want to draw conclusions about (e.g., all 5,000 employees of a corporation).' },
    { title: 'Establish the Sampling Frame', desc: 'Acquire a complete list of every member of the target population, assigning each member a unique number from 1 to N.' },
    { title: 'Determine the Sample Size', desc: 'Use statistical power formulas (such as Cochran’s or Slovin’s formula) to calculate the required sample size (n).' },
    { title: 'Generate Random Numbers', desc: 'Use a random number generator (computer software, random number tables, or lottery draws) to generate n unique numbers between 1 and N.' },
    { title: 'Select the Sample Members', desc: 'Extract the individuals corresponding to the generated random numbers from your list to form the official research sample.' }
  ];

  const stepsVi = [
    { title: 'Xác định Quần thể Mục tiêu', desc: 'Xác định toàn bộ nhóm đối tượng (N) mà bạn muốn nghiên cứu và rút ra kết luận (ví dụ: toàn bộ 5,000 nhân viên của một tập đoàn).' },
    { title: 'Xây dựng Khung mẫu (Sampling Frame)', desc: 'Lập danh sách đầy đủ tất cả các thành viên trong quần thể, đánh số thứ tự duy nhất cho mỗi thành viên từ 1 đến N.' },
    { title: 'Xác định Kích thước Mẫu', desc: 'Sử dụng các công thức thống kê (như công thức Cochran hoặc Slovin) để tính toán kích thước mẫu cần thiết (n).' },
    { title: 'Tạo Số ngẫu nhiên', desc: 'Sử dụng công cụ tạo số ngẫu nhiên (phần mềm máy tính, bảng số ngẫu nhiên, hoặc rút thăm) để tạo ra n số duy nhất từ 1 đến N.' },
    { title: 'Chọn các Thành viên vào Mẫu', desc: 'Trích xuất các cá nhân có số thứ tự trùng với các số ngẫu nhiên đã tạo để lập thành mẫu nghiên cứu chính thức.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Using a partial or outdated list of the population (undercoverage bias).',
      fix: 'Verify the sampling frame is exhaustive, containing every single eligible member of the population before drawing samples.'
    },
    {
      mistake: 'Selecting "convenient" samples instead of mathematically random ones (e.g. surveying only people who walk past a door).',
      fix: 'Use a true random number generator or lottery method so that physical proximity or ease of access does not introduce bias.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Sử dụng danh sách quần thể không đầy đủ hoặc đã lỗi thời (sai lệch do bao phủ không đủ).',
      fix: 'Xác minh khung mẫu là toàn diện, chứa mọi thành viên đủ điều kiện của quần thể trước khi tiến hành rút mẫu.'
    },
    {
      mistake: 'Lựa chọn các mẫu "thuận tiện" thay vì ngẫu nhiên toán học (ví dụ: chỉ khảo sát những người đi ngang qua cửa phòng).',
      fix: 'Sử dụng công cụ tạo số ngẫu nhiên thực sự hoặc phương pháp bốc thăm để sự gần gũi vật lý hoặc mức độ dễ tiếp cận không gây sai lệch.'
    }
  ];

  // Comparison Table data
  const tableHeadersEn = ['Feature / Metric', 'Simple Random Sampling (SRS)', 'Other Probability Methods'];
  const tableRowsEn = [
    ['Selection Probability', 'Exactly equal for every member: P = n / N', 'May vary but is known and non-zero (e.g. proportional in stratified)'],
    ['Administrative Effort', 'Low (requires only a list and generator)', 'Medium to High (requires grouping, ordering, or geographical clustering)'],
    ['Need for Auxiliary Information', 'None (only need a population list)', 'High (requires stratum parameters, ordering coordinates, or cluster maps)'],
    ['Precision of Estimators', 'Standard baseline precision', 'Often higher in stratified; can be lower in cluster sampling for same size']
  ];

  const tableHeadersVi = ['Đặc trưng / Chỉ số', 'Lấy mẫu Ngẫu nhiên Đơn giản (SRS)', 'Các Phương pháp Xác suất Khác'];
  const tableRowsVi = [
    ['Xác suất được chọn', 'Hoàn toàn bằng nhau đối với mọi thành viên: P = n / N', 'Có thể khác nhau nhưng đã biết trước và khác không (ví dụ: theo tỷ lệ trong phân lớp)'],
    ['Nỗ lực quản lý/vận hành', 'Thấp (chỉ yêu cầu một danh sách và bộ tạo số ngẫu nhiên)', 'Trung bình đến Cao (đòi hỏi phân nhóm, sắp xếp thứ tự hoặc phân cụm địa lý)'],
    ['Yêu cầu thông tin bổ trợ', 'Không có (chỉ cần danh sách quần thể)', 'Cao (yêu cầu các tham số phân lớp, thứ tự sắp xếp, hoặc bản đồ cụm)'],
    ['Độ chính xác của ước lượng', 'Độ chính xác nền tảng tiêu chuẩn', 'Thường cao hơn trong lấy mẫu phân lớp; có thể thấp hơn trong lấy mẫu cụm nếu cùng kích thước mẫu']
  ];

  // Summary bullets
  const summaryEn = [
    'Every individual has an equal probability of selection: P = n/N.',
    'It serves as the gold standard for unbiased estimation in statistical inference.',
    'It requires a complete sampling frame (list of all population members), which might not always be available.',
    'Estimation of the population mean is simply the sample mean; variance estimation incorporates the finite population correction (FPC).'
  ];

  const summaryVi = [
    'Mỗi cá nhân có xác suất được chọn hoàn toàn bằng nhau: P = n/N.',
    'Được coi là tiêu chuẩn vàng cho các ước lượng không chệch trong suy diễn thống kê.',
    'Đòi hỏi một khung mẫu đầy đủ (danh sách toàn bộ quần thể), điều mà không phải lúc nào cũng khả thi trong thực tế.',
    'Ước lượng trung bình quần thể đơn giản là trung bình mẫu; ước lượng phương sai có tích hợp hệ số hiệu chỉnh quần thể hữu hạn (FPC).'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="🔍">
        <p>
          {isVi
            ? "Lấy mẫu ngẫu nhiên đơn giản (Simple Random Sampling - SRS) là phương pháp lấy mẫu xác suất cơ bản và thuần khiết nhất. Trong phương pháp này, mỗi đối tượng trong quần thể đều có xác suất được chọn vào mẫu hoàn toàn ngang nhau, và việc lựa chọn bất kỳ đối tượng nào cũng không ảnh hưởng đến cơ hội được chọn của các đối tượng khác."
            : "Simple Random Sampling (SRS) is the most fundamental and purest form of probability sampling. In this method, every single member of the population has an exactly equal chance of being selected, and the selection of one individual does not affect the probability of selecting another."}
        </p>
        <p>
          {isVi
            ? "Hãy tưởng tượng một trò chơi bốc thăm trúng thưởng lớn, nơi tất cả tên được bỏ vào một chiếc thùng lớn trộn đều. Mỗi tấm vé có cơ hội chiến thắng như nhau. Đây là nền tảng toán học của mọi suy diễn thống kê cổ điển."
            : "Imagine a giant lottery draw where all names are written on tickets of identical size and placed in a thoroughly mixed bowl. Each ticket has the exact same probability of being drawn. This is the mathematical cornerstone of classical statistical inference."}
        </p>
        <InfoBox variant="tip">
          <strong>{isVi ? "Ký hiệu Thống kê:" : "Statistical Notation:"}</strong>
          <br />
          {isVi
            ? "Gọi N là kích thước quần thể (Population Size) và n là kích thước mẫu cần lấy (Sample Size). Xác suất để một thành viên bất kỳ được chọn vào mẫu là:"
            : "Let N be the population size and n be the sample size. The probability of any individual being selected into the sample is:"}
          <div className="my-2">
            <BlockMath math="P = \frac{n}{N}" />
          </div>
        </InfoBox>
      </Section>

      {/* Real-World Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍">
        <p>
          {isVi
            ? "Tại sao chúng ta phải lấy mẫu ngẫu nhiên? Trong thực tế, việc khảo sát toàn bộ quần thể (ví dụ: tất cả người tiêu dùng ở Việt Nam hoặc hàng tỷ thiết bị IoT) là không khả thi vì giới hạn thời gian, tài chính và nguồn nhân lực."
            : "Why do we use random sampling? In reality, surveying an entire population (for example, all consumers in a country or billions of IoT devices) is practically impossible due to budget constraints, time limitations, and physical accessibility."}
        </p>
        <p>
          {isVi
            ? "Mục đích cốt lõi của SRS là tạo ra một mẫu đại diện (representative sample) không chệch (unbiased). Bằng cách loại bỏ hoàn toàn sự can thiệp của ý chí con người và các yếu tố chủ quan trong quá trình chọn mẫu, SRS đảm bảo rằng các quy luật thống kê của mẫu sẽ phản ánh chính xác các đặc trưng thực tế của toàn bộ quần thể."
            : "The core purpose of SRS is to construct an unbiased representative sample. By removing human discretion and subjective choices from the selection process, SRS ensures that the sample's statistical properties accurately mirror those of the underlying population."}
        </p>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Thống kê" : "3. Mathematical Formulas"} icon="➗">
        <p>
          {isVi
            ? "Đối với lấy mẫu ngẫu nhiên đơn giản, các công thức chính bao gồm việc xác định kích thước mẫu cần thiết và ước lượng các đặc trưng của quần thể (trung bình, phương sai) kèm sai số."
            : "For simple random sampling, the mathematical foundation involves determining the required sample size and estimating population parameters (mean, variance) along with their precision."}
        </p>

        {/* Formula 1: Sample Size */}
        <FormulaCard
          title={isVi ? "1. Công thức Kích thước Mẫu Cochran (Cochran's Formula)" : "1. Cochran's Sample Size Formula"}
          formula="n = \frac{z^2 \cdot p \cdot (1-p)}{e^2}"
          variables={[
            { name: 'n', desc: isVi ? 'Kích thước mẫu yêu cầu' : 'Calculated required sample size' },
            { name: 'z', desc: isVi ? 'Giá trị điểm tới hạn phân phối chuẩn (ví dụ: z = 1.96 cho độ tin cậy 95%)' : 'Z-score corresponding to desired confidence level (e.g. 1.96 for 95%)' },
            { name: 'p', desc: isVi ? 'Tỷ lệ ước lượng của đặc trưng trong quần thể (thường dùng p = 0.5 để tối đa hóa kích thước mẫu an toàn)' : 'Estimated proportion of attribute present in population (0.5 yields maximum variance)' },
            { name: 'e', desc: isVi ? 'Sai số cho phép (Margin of Error, ví dụ: e = 0.05 đại diện cho sai số 5%)' : 'Margin of error (acceptable precision, e.g. 0.05 for 5%)' }
          ]}
        />

        {/* Formula 2: Mean Estimation */}
        <FormulaCard
          title={isVi ? "2. Ước lượng Trung bình Quần thể (Population Mean Estimator)" : "2. Population Mean Estimation"}
          formula="\bar{y} = \frac{1}{n} \sum_{i=1}^{n} y_i"
          variables={[
            { name: '\\bar{y}', desc: isVi ? 'Trung bình mẫu (ước lượng điểm không chệch của trung bình quần thể μ)' : 'Sample mean (unbiased point estimator of population mean μ)' },
            { name: 'y_i', desc: isVi ? 'Giá trị của phần tử thứ i trong mẫu' : 'Value of the i-th sampled unit' },
            { name: 'n', desc: isVi ? 'Kích thước mẫu' : 'Sample size' }
          ]}
        />

        {/* Formula 3: Variance of Mean Estimator */}
        <FormulaCard
          title={isVi ? "3. Phương sai của Ước lượng Trung bình (Variance of Mean Estimator with FPC)" : "3. Variance of Mean Estimator (with Finite Population Correction)"}
          formula="\text{Var}(\bar{y}) = \frac{s^2}{n} \left(1 - \frac{n}{N}\right)"
          variables={[
            { name: '\\text{Var}(\\bar{y})', desc: isVi ? 'Phương sai của trung bình mẫu (đo lường độ bất định của ước lượng)' : 'Variance of the sample mean' },
            { name: 's^2', desc: isVi ? 'Phương sai mẫu hiệu chỉnh: s^2 = \\frac{1}{n-1}\\sum(y_i - \\bar{y})^2' : 'Sample variance: s^2 = \\frac{1}{n-1}\\sum(y_i - \\bar{y})^2' },
            { name: '1 - n/N', desc: isVi ? 'Hệ số hiệu chỉnh quần thể hữu hạn (Finite Population Correction - FPC), tiến dần về 1 khi N lớn vô cùng' : 'Finite Population Correction (FPC). Approaches 1 as N becomes very large' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Mô phỏng Lấy mẫu trực quan" : "4. Interactive Sampling Simulator"} icon="🎮">
        <p>
          {isVi
            ? "Dưới đây là một mô phỏng trực quan giúp bạn hình dung cách thức hoạt động của Lấy mẫu ngẫu nhiên đơn giản. Nhấn nút 'Lấy mẫu' để chọn ngẫu nhiên các hạt tròn trong quần thể và xem cách giá trị trung bình mẫu thay đổi."
            : "Use the simulator below to visualize how Simple Random Sampling works in real time. Click 'Sample' to randomly draw a subset and observe how closely the sample mean converges to the true population mean."}
        </p>
        <SimpleRandomVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình thực hiện từng bước" : "5. Step-by-Step Execution Workflow"} icon="📋">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Pros & Cons */}
      <Section id="pros-cons" title={isVi ? "6. Ưu điểm & Nhược điểm" : "6. Advantages & Disadvantages"} icon="⚖️">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50/10 dark:bg-emerald-950/10 border border-emerald-500/20 rounded-2xl">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 text-lg">
              {isVi ? "✅ Ưu điểm" : "✅ Advantages"}
            </h4>
            <ul className="space-y-2.5 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{isVi ? "Không chệch: Đảm bảo tính trung thực thống kê cao nhất do tính ngẫu nhiên hoàn toàn." : "Highly unbiased: Ensures maximum statistical objectivity due to zero human intervention."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{isVi ? "Đơn giản: Không yêu cầu thông tin chi tiết về các đặc trưng nhóm của quần thể trước khi lấy." : "Simplicity: Requires no prior knowledge of sub-groups or sorting parameters of the population."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>{isVi ? "Dễ phân tích: Các công thức ước lượng toán học rất trực quan và không phức tạp." : "Ease of Analysis: Mathematical estimators are straightforward to calculate and interpret."}</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-rose-50/10 dark:bg-rose-950/10 border border-rose-500/20 rounded-2xl">
            <h4 className="font-bold text-rose-600 dark:text-rose-450 mb-3 text-lg">
              {isVi ? "⚠️ Nhược điểm & Hạn chế" : "⚠️ Disadvantages"}
            </h4>
            <ul className="space-y-2.5 text-sm md:text-base">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>{isVi ? "Đòi hỏi khung mẫu: Bắt buộc phải có danh sách đầy đủ tất cả phần tử trong quần thể (rất khó với quần thể lớn)." : "Requires full sampling frame: A complete list of all population units is mandatory, which is rare in large-scale studies."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>{isVi ? "Độ chính xác thấp hơn phân lớp: Có thể bỏ sót các phân nhóm nhỏ nếu phân bổ ngẫu nhiên không rơi vào chúng." : "Lower efficiency than stratified: Can completely miss small minority sub-groups by chance, leading to lower representation."}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>{isVi ? "Tốn kém địa lý: Nếu lấy mẫu khảo sát trực tiếp, các mẫu có thể phân tán khắp nơi, tăng chi phí đi lại." : "High field costs: For physical surveys, selected units can be widely scattered, increasing logistics costs."}</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Comparison */}
      <Section id="comparison" title={isVi ? "7. So sánh với các phương pháp khác" : "7. Method Comparison Matrix"} icon="📊">
        <p>
          {isVi
            ? "Bảng dưới đây so sánh lấy mẫu ngẫu nhiên đơn giản với các phương pháp lấy mẫu xác suất khác về mặt chi phí và chất lượng dữ liệu."
            : "The table below highlights how Simple Random Sampling performs compared to other probability methods in terms of operational demands and precision."}
        </p>
        <ComparisonTable
          headers={isVi ? tableHeadersVi : tableHeadersEn}
          rows={isVi ? tableRowsVi : tableRowsEn}
        />
      </Section>

      {/* Mistakes */}
      <Section id="mistakes" title={isVi ? "8. Sai lầm phổ biến cần tránh" : "8. Common Pitfalls to Avoid"} icon="❌">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Summary */}
      <SummaryCard bullets={isVi ? summaryVi : summaryEn} />
    </div>
  );
}
