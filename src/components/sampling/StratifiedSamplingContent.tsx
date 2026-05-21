import { useTranslation } from 'react-i18next';
import { Section, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import StratifiedVisualizer from './StratifiedVisualizer';

export default function StratifiedSamplingContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const stepsEn = [
    { title: 'Identify Stratification Variables', desc: 'Determine relevant demographic or characteristics variables (e.g., age, gender, income level, or geographic region) that split the population into mutually exclusive subsets.' },
    { title: 'Partition the Population into Strata', desc: 'Divide all N units of the population into L distinct subgroups (strata) based on the chosen characteristics. Every member must belong to exactly one stratum.' },
    { title: 'Determine Allocation Strategy', desc: 'Choose between Proportional Allocation (stratum sample size is proportional to stratum population size) or Optimal Allocation (Neyman Allocation, taking stratum variance into account).' },
    { title: 'Perform Simple Random Sampling within Strata', desc: 'Independently select a random sample of size n_h from each stratum h using simple random sampling techniques.' },
    { title: 'Aggregate Estimations', desc: 'Combine individual stratum results using weighted formulas to calculate overall population estimates.' }
  ];

  const stepsVi = [
    { title: 'Xác định Biến phân lớp', desc: 'Chọn biến nhân khẩu học hoặc biến đặc trưng phù hợp (ví dụ: độ tuổi, giới tính, mức thu nhập, hoặc khu vực địa lý) có liên quan mật thiết đến chủ đề nghiên cứu để phân chia quần thể.' },
    { title: 'Chia Quần thể thành các Lớp', desc: 'Phân chia tất cả N phần tử của quần thể thành L phân nhóm (lớp) riêng biệt dựa trên các đặc trưng đã chọn. Mỗi thành viên phải thuộc về duy nhất một lớp.' },
    { title: 'Quyết định Chiến lược Phân bổ', desc: 'Lựa chọn giữa Phân bổ tỷ lệ (kích thước mẫu của lớp tỷ lệ thuận với quy mô quần thể của lớp đó) hoặc Phân bổ tối ưu (Phân bổ Neyman, xem xét thêm sai số/độ lệch chuẩn trong mỗi lớp).' },
    { title: 'Lấy mẫu Ngẫu nhiên Đơn giản trong mỗi Lớp', desc: 'Tiến hành lấy mẫu ngẫu nhiên đơn giản độc lập với quy mô n_h từ từng lớp h.' },
    { title: 'Tổng hợp Ước lượng', desc: 'Kết hợp kết quả đo lường từ các lớp riêng lẻ bằng cách áp dụng các công thức trọng số để đưa ra ước lượng chung cho toàn bộ quần thể.' }
  ];

  const mistakesEn = [
    {
      mistake: 'Using overlapping strata where individuals can belong to more than one group.',
      fix: 'Strata must be mutually exclusive and collectively exhaustive. A person cannot be in both "under 18" and "18-35" groups.'
    },
    {
      mistake: 'Failing to weight the stratum means properly when computing the final overall mean (treating it as simple random sampling).',
      fix: 'Always use weighted aggregation formulas: overall mean is the sum of stratum means multiplied by their respective population weights W_h = N_h/N.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Sử dụng các lớp bị chồng chéo nhau khiến một cá nhân có thể thuộc về nhiều lớp cùng lúc.',
      fix: 'Các lớp phải loại trừ lẫn nhau (mutually exclusive) và bao phủ toàn bộ. Một đối tượng không thể vừa nằm ở lớp "dưới 18 tuổi" vừa nằm ở lớp "từ 18 đến 30 tuổi".'
    },
    {
      mistake: 'Không sử dụng đúng trọng số khi tính toán giá trị trung bình chung của quần thể (coi mẫu phân lớp như mẫu ngẫu nhiên đơn giản).',
      fix: 'Luôn sử dụng công thức tổng hợp có trọng số: trung bình chung bằng tổng trung bình các lớp nhân với trọng số quần thể tương ứng W_h = N_h/N.'
    }
  ];

  const tableHeadersEn = ['Allocation Method', 'Formula', 'Key Focus / Objective', 'Optimal Usage Case'];
  const tableRowsEn = [
    ['Proportional Allocation', 'n_h = n * (N_h / N)', 'Ensures representative ratios match the population exactly.', 'When variances within strata are similar or unknown.'],
    ['Neyman (Optimal) Allocation', 'n_h = n * (N_h S_h) / sum(N_i S_i)', 'Minimizes variance of the overall estimator for a fixed sample size.', 'When standard deviations within strata vary significantly.'],
    ['Disproportional Allocation', 'Custom weight adjustment', 'Over-samples small strata to guarantee statistically reliable subgroup analysis.', 'When very small minority strata need separate statistical tests.']
  ];

  const tableHeadersVi = ['Phương pháp Phân bổ', 'Công thức', 'Trọng tâm / Mục tiêu chính', 'Trường hợp sử dụng tối ưu'];
  const tableRowsVi = [
    ['Phân bổ theo tỷ lệ (Proportional)', 'n_h = n * (N_h / N)', 'Đảm bảo tỷ lệ đại diện trong mẫu trùng khớp hoàn hảo với quần thể thực tế.', 'Khi phương sai/độ phân tán trong các lớp tương đương nhau hoặc chưa được biết.'],
    ['Phân bổ Neyman (Tối ưu)', 'n_h = n * (N_h S_h) / \\sum(N_i S_i)', 'Tối thiểu hóa phương sai của ước lượng tổng thể với cùng một kích thước mẫu.', 'Khi độ lệch chuẩn/độ phân tán trong các lớp khác biệt rõ rệt.'],
    ['Phân bổ phi tỷ lệ (Disproportional)', 'Điều chỉnh trọng số tùy chọn', 'Lấy vượt mức (over-sampling) ở các lớp rất nhỏ để đảm bảo đủ dữ liệu phân tích tin cậy.', 'Khi các phân lớp thiểu số cực kỳ nhỏ cần được kiểm định thống kê riêng biệt.']
  ];

  const summaryEn = [
    'Stratified sampling groups the population into homogeneous strata (low variance within, high variance between).',
    'It guarantees representation of small, key subgroups in the final sample.',
    'Proportional allocation uses the weight W_h = N_h/N to determine n_h.',
    'Neyman optimal allocation adjusts sample sizes based on standard deviations to achieve maximum estimation precision.'
  ];

  const summaryVi = [
    'Lấy mẫu phân lớp chia quần thể thành các phân lớp đồng nhất (phương sai trong lớp nhỏ, phương sai giữa các lớp lớn).',
    'Đảm bảo sự hiện diện đầy đủ của các nhóm thiểu số hoặc phân nhóm quan trọng trong mẫu cuối cùng.',
    'Phân bổ tỷ lệ sử dụng trọng số W_h = N_h/N để xác định kích thước mẫu từng lớp n_h.',
    'Phân bổ tối ưu Neyman điều chỉnh cỡ mẫu lớp dựa trên độ lệch chuẩn của lớp nhằm đạt độ chính xác ước lượng cao nhất.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="🎨">
        <p>
          {isVi
            ? "Lấy mẫu phân lớp (Stratified Sampling) là phương pháp lấy mẫu xác suất mà trong đó, trước tiên quần thể được chia thành các nhóm phụ loại trừ lẫn nhau được gọi là các 'lớp' (strata). Sau đó, việc lấy mẫu ngẫu nhiên đơn giản được thực hiện độc lập trong mỗi lớp để rút ra mẫu cuối cùng."
            : "Stratified Sampling is a probability sampling technique where the population is first divided into mutually exclusive subgroups, called 'strata', based on auxiliary information. Subsequently, independent simple random samples are drawn from within each stratum to build the final aggregate sample."}
        </p>
        <p>
          {isVi
            ? "Mục tiêu cơ bản của phân lớp là tăng độ chính xác của ước lượng bằng cách đảm bảo rằng các nhóm quan trọng đều có đại diện thích hợp. Về mặt cấu trúc, các lớp được thiết kế sao cho các phần tử bên trong một lớp càng giống nhau càng tốt (đồng nhất - homogeneous), trong khi sự khác biệt giữa các lớp là lớn nhất (dị biệt - heterogeneous)."
            : "The fundamental goal of stratification is to increase estimator precision by ensuring key subgroups are adequately represented. Ideally, strata are designed to contain highly similar units within each stratum (homogeneous), while having significant differences between strata (heterogeneous)."}
        </p>
      </Section>

      {/* Real-World Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍">
        <p>
          {isVi
            ? "Trong thực tế, khi khảo sát về sự hài lòng của sinh viên trường đại học, nếu sử dụng ngẫu nhiên đơn giản, rất có thể mẫu của chúng ta sẽ không có bất kỳ đại diện nào của sinh viên năm cuối (vì số lượng ít hơn). Bằng cách chia sinh viên thành 4 lớp theo năm học (Năm 1, 2, 3, 4) rồi rút mẫu từ mỗi lớp, ta đảm bảo ý kiến của sinh viên năm cuối được ghi nhận đầy đủ."
            : "In practical terms, if you conduct a university survey on student satisfaction using simple random sampling, you might by chance select very few senior students (since they are a smaller subgroup). By dividing students into 4 strata by year of study (1st, 2nd, 3rd, 4th year) and sampling from each, you guarantee that senior students are properly represented and their opinions are measured reliably."}
        </p>
        <p>
          {isVi
            ? "Nói chung, phương pháp này được sử dụng khi:"
            : "Generally, this method is preferred when:"}
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li>{isVi ? "Quần thể có các nhóm con rõ rệt và độ phân tán lớn." : "The population is highly diverse with clearly identifiable subgroups."}</li>
          <li>{isVi ? "Nghiên cứu yêu cầu so sánh kết quả thống kê giữa các phân nhóm." : "The research project specifically requires comparative analysis between subgroups."}</li>
          <li>{isVi ? "Cần giảm sai số của các ước lượng chung bằng cách tận dụng các thông tin bổ trợ có sẵn." : "The investigator wants to reduce variance of global estimators by leveraging auxiliary information."}</li>
        </ul>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Phân bổ" : "3. Mathematical Estimators & Allocations"} icon="➗">
        <p>
          {isVi
            ? "Toán học của lấy mẫu phân lớp xoay quanh việc phân bổ kích thước mẫu cho các lớp khác nhau và cách tổng hợp kết quả để đưa ra ước lượng toàn cục không chệch."
            : "The mathematics of stratified sampling revolves around allocating the sample size to various strata and calculating unbiased global estimators from the individual stratum components."}
        </p>

        {/* Formula 1: Proportional Allocation */}
        <FormulaCard
          title={isVi ? "1. Phân bổ theo Tỷ lệ (Proportional Allocation)" : "1. Proportional Allocation Formula"}
          formula="n_h = n \cdot \left(\frac{N_h}{N}\right) = n \cdot W_h"
          variables={[
            { name: 'n_h', desc: isVi ? 'Kích thước mẫu phân bổ cho lớp h' : 'Sample size allocated to stratum h' },
            { name: 'n', desc: isVi ? 'Tổng kích thước mẫu nghiên cứu' : 'Total desired sample size' },
            { name: 'N_h', desc: isVi ? 'Kích thước quần thể của lớp h' : 'Total population size of stratum h' },
            { name: 'N', desc: isVi ? 'Tổng kích thước quần thể' : 'Total population size' },
            { name: 'W_h', desc: isVi ? 'Trọng số quần thể của lớp h (N_h / N)' : 'Stratum weight (N_h / N)' }
          ]}
        />

        {/* Formula 2: Neyman Optimal Allocation */}
        <FormulaCard
          title={isVi ? "2. Phân bổ Tối ưu Neyman (Neyman Optimal Allocation)" : "2. Neyman Optimal Allocation"}
          formula="n_h = n \cdot \frac{N_h \cdot S_h}{\sum_{i=1}^{L} N_i \cdot S_i}"
          variables={[
            { name: 'S_h', desc: isVi ? 'Độ lệch chuẩn (phương sai) của đặc trưng bên trong lớp h. Lớp nào có độ phân tán lớn hơn sẽ được phân bổ cỡ mẫu lớn hơn.' : 'Standard deviation of the variable within stratum h. Higher variance within a stratum results in more samples allocated to it.' },
            { name: 'N_h', desc: isVi ? 'Quy mô quần thể của lớp h' : 'Stratum population size' },
            { name: 'n', desc: isVi ? 'Tổng kích thước mẫu' : 'Total sample size' }
          ]}
        />

        {/* Formula 3: Stratified Mean Estimator */}
        <FormulaCard
          title={isVi ? "3. Trung bình Mẫu Phân lớp (Stratified Mean Estimator)" : "3. Stratified Mean Estimation"}
          formula="\bar{y}_{st} = \sum_{h=1}^{L} W_h \cdot \bar{y}_h"
          variables={[
            { name: '\\bar{y}_{st}', desc: isVi ? 'Trung bình mẫu phân lớp (ước lượng không chệch của trung bình quần thể μ)' : 'Weighted stratified mean estimator' },
            { name: '\\bar{y}_h', desc: isVi ? 'Trung bình mẫu thực tế tính toán trong lớp h: \\bar{y}_h = \\frac{1}{n_h}\\sum y_{hi}' : 'Sample mean within stratum h' },
            { name: 'W_h', desc: isVi ? 'Trọng số của lớp h (N_h / N)' : 'Stratum weight (N_h / N)' }
          ]}
        />

        {/* Formula 4: Variance of Stratified Mean */}
        <FormulaCard
          title={isVi ? "4. Phương sai của Ước lượng Trung bình Phân lớp" : "4. Variance of the Stratified Mean"}
          formula="\text{Var}(\bar{y}_{st}) = \sum_{h=1}^{L} W_h^2 \cdot \frac{s_h^2}{n_h} \cdot \left(1 - \frac{n_h}{N_h}\right)"
          variables={[
            { name: 's_h^2', desc: isVi ? 'Phương sai mẫu hiệu chỉnh của lớp h' : 'Sample variance within stratum h' },
            { name: '1 - n_h/N_h', desc: isVi ? 'Hệ số hiệu chỉnh hữu hạn FPC cho từng lớp h' : 'Finite Population Correction (FPC) for stratum h' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Mô phỏng Phân bổ Tỷ lệ trực quan" : "4. Interactive Strata Simulator"} icon="🎮">
        <p>
          {isVi
            ? "Mô phỏng trực quan dưới đây chia quần thể ra làm 3 lớp phân biệt (Đỏ, Xanh dương, Xanh lá). Khi thay đổi tổng kích thước mẫu bằng thanh trượt, hãy quan sát kích cỡ mẫu của mỗi lớp tự động điều chỉnh theo tỷ lệ phân bổ."
            : "This simulator visualizes a population partitioned into 3 distinct color-coded strata (Red, Blue, Green). As you slide the total sample size, note how the individual stratum sample sizes adjust proportionally."}
        </p>
        <StratifiedVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình thực hiện từng bước" : "5. Step-by-Step Stratification Workflow"} icon="📋">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Allocation Methods Table */}
      <Section id="allocations" title={isVi ? "6. Các Phương án Phân bổ mẫu" : "6. Allocation Strategies Compared"} icon="⚖️">
        <p>
          {isVi
            ? "Việc lựa chọn phương án phân bổ mẫu vào các lớp phụ thuộc vào thông tin sẵn có và chi phí nghiên cứu."
            : "Selecting how to distribute sample resources among strata depends on statistical objectives and resource constraints."}
        </p>
        <ComparisonTable
          headers={isVi ? tableRowsVi[0] && tableHeadersVi : tableHeadersEn}
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
