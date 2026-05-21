import { useTranslation } from 'react-i18next';
import { Section, InfoBox, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import SystematicVisualizer from './SystematicVisualizer';


export default function SystematicSamplingContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const stepsEn = [
    { title: 'Determine the Interval (k)', desc: 'Divide the total population size (N) by the desired sample size (n) to calculate the systematic sampling interval: k = N / n.' },
    { title: 'Select a Random Start (r)', desc: 'Choose a starting point at random from numbers between 1 and k. Let this integer be r.' },
    { title: 'Identify Sample Sequence', desc: 'Determine the positions of the members to select. The sequence is defined as: r, r + k, r + 2k, r + 3k, ..., up to r + (n-1)k.' },
    { title: 'Select the Elements', desc: 'Extract the elements at those exact sequence positions from the ordered list to form your sample.' }
  ];

  const stepsVi = [
    { title: 'Xác định Khoảng cách Bước nhảy (k)', desc: 'Chia tổng quy mô quần thể (N) cho cỡ mẫu mong muốn (n) để tính khoảng cách lấy mẫu: k = N / n (lấy phần nguyên).' },
    { title: 'Chọn Điểm khởi đầu Ngẫu nhiên (r)', desc: 'Lựa chọn ngẫu nhiên một số nguyên làm điểm bắt đầu từ 1 đến k. Gọi số này là r.' },
    { title: 'Thiết lập Chuỗi lấy mẫu', desc: 'Xác định các vị trí của phần tử cần chọn theo chuỗi số học: r, r + k, r + 2k, r + 3k, ..., cho đến r + (n-1)k.' },
    { title: 'Rút các Phần tử vào Mẫu', desc: 'Rút các phần tử tại đúng các vị trí trong chuỗi từ danh sách đã sắp xếp để lập thành mẫu nghiên cứu chính thức.' }
  ];

  const mistakesEn = [
    {
      mistake: 'Ignoring periodicity (cyclical patterns) in the population list that match the interval k (e.g. sampling every 7th day, picking only Mondays).',
      fix: 'Inspect the population order beforehand. If periodic cycles exist, shuffle the list or choose a different sampling technique like simple random sampling.'
    },
    {
      mistake: 'Using a non-random starting point (e.g. always picking the first item on the list).',
      fix: 'Use a random number generator to select the initial starting value r in the interval [1, k] to maintain probability sampling requirements.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Bỏ qua tính tuần hoàn (chu kỳ) trong danh sách quần thể trùng hợp với bước nhảy k (ví dụ: lấy mẫu cách nhau 7 ngày sẽ luôn trúng vào ngày Thứ Hai).',
      fix: 'Kiểm tra kỹ trật tự sắp xếp của quần thể trước khi lấy mẫu. Nếu có chu kỳ tuần hoàn, hãy xáo trộn danh sách hoặc đổi sang lấy mẫu ngẫu nhiên đơn giản.'
    },
    {
      mistake: 'Sử dụng điểm bắt đầu cố định, phi ngẫu nhiên (ví dụ: luôn chọn phần tử đầu tiên trong danh sách làm r).',
      fix: 'Sử dụng công cụ tạo số ngẫu nhiên để chọn giá trị r ban đầu nằm trong đoạn [1, k] nhằm đáp ứng yêu cầu của lấy mẫu xác suất.'
    }
  ];

  const tableHeadersEn = ['Population Structure', 'Impact on Systematic Sampling', 'Comparison to Simple Random Sampling'];
  const tableRowsEn = [
    ['Completely Random Order', 'No specific structure. Acts like a shuffled deck.', 'Yields similar precision and variance estimators as Simple Random Sampling.'],
    ['Ordered Trend (Linear)', 'Spreads samples perfectly across the entire range (e.g., small to large).', 'More precise (lower variance of estimator) than Simple Random Sampling.'],
    ['Periodic / Cyclical Order', 'If cycle frequency matches k, sample is highly biased. If out of phase, it is highly unrepresentative.', 'Significantly less precise. Can yield severe estimator bias.']
  ];

  const tableHeadersVi = ['Cấu trúc của Quần thể', 'Tác động tới Lấy mẫu Hệ thống', 'So sánh hiệu quả với Lấy mẫu Ngẫu nhiên Đơn giản'];
  const tableRowsVi = [
    ['Sắp xếp hoàn toàn ngẫu nhiên', 'Không có cấu trúc đặc biệt. Giống như một cỗ bài đã xáo trộn.', 'Cho độ chính xác và phương sai ước lượng tương tự như Lấy mẫu Ngẫu nhiên Đơn giản.'],
    ['Có xu hướng tăng/giảm dần (Tuyến tính)', 'Trải đều các mẫu được chọn trên toàn bộ phạm vi (ví dụ: từ thấp đến cao).', 'Độ chính xác cao hơn (phương sai ước lượng nhỏ hơn) so với Lấy mẫu Ngẫu nhiên Đơn giản.'],
    ['Có tính chu kỳ / Tuần hoàn', 'Nếu tần số chu kỳ trùng với khoảng cách k, mẫu sẽ cực kỳ lệch. Nếu lệch pha, nó sẽ không mang tính đại diện.', 'Độ chính xác kém hơn đáng kể. Có thể gây ra sai lệch nghiêm trọng trong ước lượng.']
  ];

  const summaryEn = [
    'Systematic sampling selects elements at a regular interval: k = N/n.',
    'A random starting point r must be selected in the interval [1, k].',
    'It is highly efficient to perform and spread samples uniformly over space, time, or order.',
    'Be extremely cautious of periodicity in the population list, which can invalidate the random sampling assumptions.'
  ];

  const summaryVi = [
    'Lấy mẫu hệ thống lựa chọn các phần tử theo khoảng cách đều đặn: k = N/n.',
    'Điểm khởi đầu r phải được chọn ngẫu nhiên trong khoảng từ 1 đến k.',
    'Cực kỳ dễ thực hiện trong thực tế và phân bổ mẫu đều theo không gian, thời gian hoặc thứ tự.',
    'Cần đặc biệt cẩn trọng với tính tuần hoàn trong danh sách quần thể, điều này có thể làm mất giá trị giả định ngẫu nhiên.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="📅">
        <p>
          {isVi
            ? "Lấy mẫu hệ thống (Systematic Sampling) là phương pháp lấy mẫu xác suất mà trong đó, các thành viên của mẫu được lựa chọn từ một quần thể đã được sắp xếp theo một khoảng cách toán học cố định, được gọi là khoảng cách lấy mẫu (sampling interval)."
            : "Systematic Sampling is a probability sampling method where researchers select members of the sample from an ordered population at a regular, fixed mathematical interval, known as the sampling interval."}
        </p>
        <p>
          {isVi
            ? "Phương pháp này bắt đầu bằng cách chọn ngẫu nhiên một phần tử đầu tiên (điểm khởi đầu ngẫu nhiên - random start) từ vị trí số 1 đến vị trí k, sau đó cứ sau mỗi bước nhảy k, ta lại chọn phần tử tiếp theo cho đến khi đủ số lượng mẫu n."
            : "The process begins by choosing a starting point at random (random start) from within the first k elements on the list, and then selecting every k-th element thereafter until the desired sample size n is achieved."}
        </p>
        <InfoBox variant="tip">
          <strong>{isVi ? "Ví dụ trực quan:" : "Intuitive Example:"}</strong>
          <br />
          {isVi
            ? "Khảo sát chất lượng sản phẩm trên dây chuyền lắp ráp. Cứ mỗi sản phẩm thứ 10 đi qua, kỹ sư sẽ lấy 1 sản phẩm để kiểm tra chất lượng. Đây là dạng ứng dụng phổ biến nhất của lấy mẫu hệ thống."
            : "Checking product quality on an assembly line. Every 10th item that passes is pulled by the quality engineer for testing. This is the most common real-world application of systematic sampling."}
        </InfoBox>
      </Section>

      {/* Real-World Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍">
        <p>
          {isVi
            ? "Lấy mẫu hệ thống được ưa chuộng rộng rãi nhờ sự đơn giản và tốc độ thực hiện. Thay vì phải liên tục tạo ra hàng trăm số ngẫu nhiên khác nhau như trong lấy mẫu ngẫu nhiên đơn giản, bạn chỉ cần tạo duy nhất một số ngẫu nhiên ban đầu (r) và cộng dồn bước nhảy k."
            : "Systematic sampling is widely preferred because of its simplicity and operational efficiency. Instead of generating hundreds of random numbers as in simple random sampling, you only generate a single random start (r) and then execute a simple repetitive arithmetic addition (+k)."}
        </p>
        <p>
          {isVi
            ? "Hơn nữa, nếu quần thể được sắp xếp theo thứ tự nhất định (ví dụ: danh sách khách hàng xếp theo mức chi tiêu từ thấp đến cao), lấy mẫu hệ thống sẽ giúp trải đều mẫu trên toàn bộ thang chi tiêu, giúp mẫu mang tính đại diện rất cao."
            : "Furthermore, if the population is sorted in a specific logical order (for example, customers ordered by purchase value from low to high), systematic sampling spreads the samples uniformly across the entire sorting spectrum, capturing representatives of all spending levels."}
        </p>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Khoảng cách" : "3. Mathematical Formulation"} icon="➗">
        <p>
          {isVi
            ? "Các công thức toán học nền tảng của lấy mẫu hệ thống tập trung vào khoảng cách lấy mẫu k và các chỉ số vị trí phần tử được chọn."
            : "The mathematical backbone of systematic sampling revolves around the interval formula k and calculating the position sequence indices."}
        </p>

        {/* Formula 1: Sampling Interval */}
        <FormulaCard
          title={isVi ? "1. Công thức Khoảng cách Lấy mẫu (Sampling Interval Formula)" : "1. Systematic Sampling Interval Formula"}
          formula="k = \frac{N}{n}"
          variables={[
            { name: 'k', desc: isVi ? 'Khoảng cách lấy mẫu (thường được làm tròn xuống số nguyên gần nhất)' : 'Sampling interval (typically rounded down to the nearest integer)' },
            { name: 'N', desc: isVi ? 'Tổng quy mô quần thể' : 'Total population size' },
            { name: 'n', desc: isVi ? 'Kích thước mẫu mong muốn' : 'Desired sample size' }
          ]}
        />

        {/* Formula 2: Selection Sequence */}
        <FormulaCard
          title={isVi ? "2. Vị trí các Phần tử được Chọn (Selection Sequence Index)" : "2. Selection Sequence Formula"}
          formula="i_m = r + (m - 1) \cdot k"
          variables={[
            { name: 'i_m', desc: isVi ? 'Vị trí của phần tử thứ m được chọn vào mẫu' : 'Index location of the m-th sampled unit' },
            { name: 'r', desc: isVi ? 'Điểm khởi đầu ngẫu nhiên: r \in \{1, 2, \dots, k\}' : 'Random starting index chosen such that 1 <= r <= k' },
            { name: 'm', desc: isVi ? 'Thứ tự phần tử trong mẫu: m \in \{1, 2, \dots, n\}' : 'Sample sequence index (1, 2, ..., n)' },
            { name: 'k', desc: isVi ? 'Khoảng cách lấy mẫu' : 'Sampling interval' }
          ]}
        />

        {/* Formula 3: Mean Estimator */}
        <FormulaCard
          title={isVi ? "3. Trung bình Mẫu Hệ thống (Mean Estimator)" : "3. Systematic Mean Estimation"}
          formula="\bar{y}_{sys} = \frac{1}{n} \sum_{m=1}^{n} y_{r + (m-1)k}"
          variables={[
            { name: '\\bar{y}_{sys}', desc: isVi ? 'Trung bình mẫu hệ thống (ước lượng điểm của trung bình quần thể μ)' : 'Systematic sample mean' },
            { name: 'y', desc: isVi ? 'Giá trị của phần tử tại vị trí tương ứng trong danh sách quần thể' : 'Value of the element at the specified index position' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Mô phỏng Lấy mẫu Hệ thống trực quan" : "4. Interactive Systematic Simulator"} icon="🎮">
        <p>
          {isVi
            ? "Mô phỏng dưới đây xếp 60 phần tử theo thứ tự từ 1 đến 60. Hãy điều chỉnh thanh trượt kích cỡ mẫu và xem hệ thống tính toán khoảng cách k, thực hiện chọn điểm bắt đầu ngẫu nhiên (r) màu xanh lá, và tự động nhảy các bước k màu vàng."
            : "The simulator below arranges 60 numbered population elements. Adjust the sample size slider, and watch the system compute the step interval k, draw a green random starting point r, and step forward by adding interval k (yellow dots)."}
        </p>
        <SystematicVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình thực hiện từng bước" : "5. Step-by-Step Systematic Workflow"} icon="📋">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Ordering impacts table */}
      <Section id="ordering" title={isVi ? "6. Ảnh hưởng từ Trật tự Quần thể" : "6. Influence of Population Structure"} icon="📈">
        <p>
          {isVi
            ? "Trong lấy mẫu hệ thống, cách thức sắp xếp danh sách quần thể ban đầu có tác động quyết định đến độ chính xác và tính không chệch của ước lượng."
            : "In systematic sampling, the initial order of the population list has a profound impact on the statistical validity of the resulting estimators."}
        </p>
        <ComparisonTable
          headers={isVi ? tableHeadersVi : tableHeadersEn}
          rows={isVi ? tableRowsVi : tableRowsEn}
        />
      </Section>

      {/* Mistakes */}
      <Section id="mistakes" title={isVi ? "7. Sai lầm phổ biến cần tránh" : "7. Common Pitfalls to Avoid"} icon="❌">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Summary */}
      <SummaryCard bullets={isVi ? summaryVi : summaryEn} />
    </div>
  );
}
