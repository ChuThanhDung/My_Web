import { useTranslation } from 'react-i18next';
import { Section, InfoBox, FormulaCard, ComparisonTable, CommonMistakes, SummaryCard, StepGuide } from './SamplingSharedComponents';
import ClusterVisualizer from './ClusterVisualizer';

export default function ClusterSamplingContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  const stepsEn = [
    { title: 'Define the Clusters', desc: 'Divide the population into subgroups that are internally heterogeneous but externally similar (e.g., city blocks, schools, or branch offices). These subgroups are called Clusters.' },
    { title: 'Build the Cluster Sampling Frame', desc: 'Create a complete list of all cluster groups (Primary Sampling Units - PSUs) rather than compiling a list of every single individual in the population.' },
    { title: 'Determine Number of Clusters (m) to Select', desc: 'Calculate the required number of clusters based on budget, cluster size variability, and the design effect (Deff).' },
    { title: 'Randomly Select Clusters', desc: 'Use Simple Random Sampling or Systematic Sampling to select a subset of m clusters from the list.' },
    { title: 'Survey the Members', desc: 'For Single-Stage Cluster Sampling, survey EVERY individual within the selected clusters. For Two-Stage Cluster Sampling, randomly select individuals within the chosen clusters.' }
  ];

  const stepsVi = [
    { title: 'Xác định các Cụm', desc: 'Phân chia quần thể thành các phân nhóm có tính chất dị biệt bên trong nhưng tương đồng bên ngoài (ví dụ: các tổ dân phố, các trường học, hoặc các văn phòng chi nhánh). Các phân nhóm này gọi là các Cụm.' },
    { title: 'Lập Khung mẫu Cấp Cụm', desc: 'Lập danh sách đầy đủ tất cả các cụm (Đơn vị mẫu cấp một - PSUs) thay vì lập danh sách của từng cá nhân riêng lẻ trong toàn bộ quần thể.' },
    { title: 'Xác định Số lượng Cụm (m) Cần lấy', desc: 'Tính toán số lượng cụm cần chọn dựa trên ngân sách, sự biến động về quy mô của các cụm và hệ số thiết kế (Deff).' },
    { title: 'Chọn ngẫu nhiên các Cụm', desc: 'Sử dụng phương pháp lấy mẫu ngẫu nhiên đơn giản hoặc lấy mẫu hệ thống để rút ra m cụm từ danh sách các cụm đã lập.' },
    { title: 'Khảo sát các Thành viên', desc: 'Với Lấy mẫu cụm một giai đoạn, tiến hành đo lường TOÀN BỘ cá thể trong các cụm được chọn. Với Lấy mẫu cụm hai giai đoạn, tiếp tục chọn ngẫu nhiên các cá thể bên trong các cụm đã chọn.' }
  ];

  const mistakesEn = [
    {
      mistake: 'Confusing Cluster Sampling with Stratified Sampling.',
      fix: 'Remember: In Stratified Sampling, we divide the population into homogeneous groups and sample SOME members from EVERY group. In Cluster Sampling, we divide the population into heterogeneous groups, select SOME groups randomly, and sample EVERY member from the selected groups.'
    },
    {
      mistake: 'Ignoring the Design Effect (Deff) and using simple random sampling sample size formulas, leading to underpowered studies.',
      fix: 'Since clusters usually contain highly correlated individuals (homophily), multiply the required sample size by the Design Effect (Deff) to compensate for loss of precision.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Nhầm lẫn giữa Lấy mẫu Cụm (Cluster Sampling) và Lấy mẫu Phân lớp (Stratified Sampling).',
      fix: 'Ghi nhớ: Trong lấy mẫu phân lớp, ta chia quần thể thành các nhóm đồng nhất và lấy mẫu một PHẦN từ MỌI nhóm. Trong lấy mẫu cụm, ta chia quần thể thành các nhóm dị biệt, chọn ngẫu nhiên một SỐ nhóm và khảo sát TOÀN BỘ thành viên thuộc các nhóm được chọn.'
    },
    {
      mistake: 'Bỏ qua Hệ số Thiết kế (Design Effect - Deff) và sử dụng trực tiếp công thức kích thước mẫu của lấy mẫu ngẫu nhiên đơn giản, dẫn đến việc mẫu thu được quá nhỏ.',
      fix: 'Vì các thành viên trong cùng một cụm thường có xu hướng giống nhau (tính đồng nhất nhóm), ta phải nhân kích thước mẫu yêu cầu với hệ số Deff để bù đắp cho sự sụt giảm độ chính xác.'
    }
  ];

  const tableHeadersEn = ['Dimension', 'Stratified Sampling', 'Cluster Sampling'];
  const tableRowsEn = [
    ['Group Characteristics', 'Homogeneous within strata, heterogeneous between strata.', 'Heterogeneous within clusters, homogeneous between clusters.'],
    ['Selection Mechanics', 'Sample some elements from ALL strata.', 'Sample ALL elements from SOME randomly chosen clusters.'],
    ['Primary Goal', 'Maximize precision of estimators, capture minority subgroups.', 'Minimize data collection cost and bypass the need for a full individual list.'],
    ['Sampling Frame Requirement', 'Requires a complete list of all individuals sorted/grouped.', 'Only requires a complete list of the clusters (groups).'],
    ['Precision / Variance', 'Higher precision (lower variance) than SRS of same size.', 'Lower precision (higher variance) than SRS of same size due to clustering effect.']
  ];

  const tableHeadersVi = ['Tiêu chí', 'Lấy mẫu Phân lớp (Stratified)', 'Lấy mẫu Cụm (Cluster)'];
  const tableRowsVi = [
    ['Đặc trưng của Nhóm', 'Đồng nhất bên trong từng lớp, dị biệt giữa các lớp.', 'Dị biệt bên trong từng cụm, đồng nhất giữa các cụm.'],
    ['Cơ chế lựa chọn', 'Chọn một PHẦN phần tử từ TẤT CẢ các lớp.', 'Chọn TẤT CẢ phần tử từ MỘT SỐ cụm ngẫu nhiên.'],
    ['Mục tiêu chính', 'Tối đa hóa độ chính xác ước lượng, đảm bảo đại diện cho nhóm thiểu số.', 'Tối thiểu hóa chi phí thu thập dữ liệu và bỏ qua yêu cầu lập danh sách cá nhân.'],
    ['Yêu cầu Khung mẫu', 'Đòi hỏi danh sách đầy đủ tất cả cá nhân kèm thông tin phân loại.', 'Chỉ yêu cầu danh sách của các cụm (không cần danh sách cá nhân trong cụm).'],
    ['Độ chính xác / Phương sai', 'Độ chính xác cao hơn (phương sai nhỏ hơn) lấy mẫu ngẫu nhiên đơn giản.', 'Độ chính xác thấp hơn (phương sai lớn hơn) lấy mẫu ngẫu nhiên đơn giản vì hiệu ứng cụm.']
  ];

  const summaryEn = [
    'Cluster sampling is used when population units are naturally grouped, making individual listing too costly.',
    'It operates on the principle of selecting whole groups (clusters) randomly, rather than individuals.',
    'Estimators are calculated by weighting clusters based on their sizes (M_i).',
    'Design Effect (Deff) adjusts the sample size to counteract homophilic clustering within groups.'
  ];

  const summaryVi = [
    'Lấy mẫu cụm được sử dụng khi các phần tử quần thể phân cụm tự nhiên, làm giảm chi phí lập khung mẫu cá nhân.',
    'Hoạt động trên nguyên lý chọn ngẫu nhiên toàn bộ nhóm (cụm) thay vì chọn riêng lẻ từng cá thể.',
    'Ước lượng được tính toán bằng cách áp dụng trọng số cho các cụm dựa trên quy mô của chúng (M_i).',
    'Hệ số Thiết kế (Deff) điều chỉnh quy mô cỡ mẫu để bù đắp cho tính đồng nhất cao trong nội bộ các cụm.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="👥">
        <p>
          {isVi
            ? "Lấy mẫu cụm (Cluster Sampling) là phương pháp lấy mẫu xác suất mà trong đó, quần thể được chia thành các nhóm nhỏ gọi là 'cụm' (clusters). Khác với lấy mẫu phân lớp - nơi chúng ta rút các phần tử từ mỗi nhóm, lấy mẫu cụm chọn ngẫu nhiên một số cụm và nghiên cứu toàn bộ thành viên trong các cụm đã chọn."
            : "Cluster Sampling is a probability sampling method where the target population is divided into subgroups called 'clusters'. Unlike stratified sampling—where we sample individuals from every single stratum—cluster sampling randomly selects a subset of whole clusters and surveys all members within the selected clusters."}
        </p>
        <p>
          {isVi
            ? "Để đạt hiệu quả tối ưu, các cụm lý tưởng nên chứa những phần tử có đặc trưng đa dạng (dị biệt bên trong - heterogeneous within). Nhờ vậy, mỗi cụm đóng vai trò như một phiên bản thu nhỏ mang tính đại diện cho toàn bộ quần thể."
            : "For maximum statistical efficiency, clusters should ideally contain highly diverse units (internally heterogeneous), so that each individual cluster serves as a representative miniature representation of the entire population."}
        </p>
        <InfoBox variant="info">
          <strong>{isVi ? "Sự Khác Biệt Cốt Lõi:" : "The Core Contrast:"}</strong>
          <br />
          {isVi
            ? "Lấy mẫu Phân lớp cố gắng làm cho các lớp càng đồng nhất càng tốt. Lấy mẫu Cụm cố gắng làm cho các cụm phản ánh đầy đủ sự đa dạng của toàn quần thể, cho phép chúng ta chỉ cần khảo sát một vài cụm là đủ đại diện."
            : "Stratified Sampling attempts to make strata as homogeneous as possible. Cluster Sampling aims to have each cluster reflect the diversity of the entire population, allowing researchers to study only a few clusters while still capturing a representative sample."}
        </InfoBox>
      </Section>

      {/* Real-World Meaning & Purpose */}
      <Section id="purpose" title={isVi ? "2. Ý nghĩa thực tế & Mục đích sử dụng" : "2. Real-World Meaning & Purpose"} icon="🌍">
        <p>
          {isVi
            ? "Tại sao lại chọn lấy mẫu cụm nếu nó có độ chính xác thống kê thấp hơn lấy mẫu ngẫu nhiên đơn giản? Câu trả lời nằm ở chi phí và tính khả thi trong thực tế."
            : "Why choose cluster sampling if it typically yields lower statistical precision than simple random sampling? The answer lies in logistical feasibility and cost-efficiency."}
        </p>
        <p>
          {isVi
            ? "Giả sử bạn muốn khảo sát mức lương trung bình của giáo viên tiểu học trên toàn quốc. Sẽ cực kỳ khó khăn và tốn kém để lập một danh sách đầy đủ hàng trăm nghìn giáo viên rồi chọn ngẫu nhiên 1,000 người rải rác khắp nước. Thay vào đó, bạn lập danh sách các trường học (cụm), chọn ngẫu nhiên 30 trường, và khảo sát toàn bộ giáo viên ở 30 trường đó. Việc này tiết kiệm tối đa chi phí đi lại và quản lý dự án."
            : "Suppose you want to survey the average salary of primary school teachers nationwide. It would be nearly impossible and extremely expensive to build a master list of all teachers, draw 1,000 names randomly, and travel to survey them individually. Instead, you compile a list of schools (clusters), randomly select 30 schools, and survey all teachers working in those 30 schools. This greatly minimizes logistics, travel costs, and administrative burdens."}
        </p>
      </Section>

      {/* Mathematics and Formulas */}
      <Section id="math" title={isVi ? "3. Công thức Toán học & Hệ số Thiết kế" : "3. Mathematical Formulation & Design Effect"} icon="➗">
        <p>
          {isVi
            ? "Toán học của lấy mẫu cụm phức tạp hơn do quy mô các cụm thường không bằng nhau và sự tương quan giữa các phần tử trong cùng một cụm."
            : "The mathematics of cluster sampling is more intricate because clusters typically vary in size, and individuals within the same cluster are often highly correlated."}
        </p>

        {/* Formula 1: Cluster Mean Estimator */}
        <FormulaCard
          title={isVi ? "1. Ước lượng Trung bình Cụm (Cluster Mean Estimator)" : "1. Cluster Mean Estimator"}
          formula="\bar{y}_c = \frac{\sum_{i=1}^{m} M_i \cdot \bar{y}_i}{\sum_{i=1}^{m} M_i} = \frac{\sum_{i=1}^{m} \sum_{j=1}^{M_i} y_{ij}}{\sum_{i=1}^{m} M_i}"
          variables={[
            { name: '\\bar{y}_c', desc: isVi ? 'Ước lượng trung bình quần thể từ lấy mẫu cụm' : 'Estimated population mean based on cluster sample' },
            { name: 'm', desc: isVi ? 'Số lượng cụm được chọn vào mẫu' : 'Number of selected clusters' },
            { name: 'M_i', desc: isVi ? 'Tổng số phần tử trong cụm thứ i' : 'Total number of elements in the i-th cluster' },
            { name: '\\bar{y}_i', desc: isVi ? 'Trung bình mẫu của cụm thứ i' : 'Sample mean of the i-th cluster' },
            { name: 'y_{ij}', desc: isVi ? 'Giá trị của phần tử thứ j thuộc cụm thứ i' : 'Value of the j-th individual in the i-th cluster' }
          ]}
        />

        {/* Formula 2: Design Effect */}
        <FormulaCard
          title={isVi ? "2. Hệ số Thiết kế (Design Effect - Deff)" : "2. Design Effect (Deff) Formula"}
          formula="\text{Deff} = 1 + (\bar{M} - 1) \cdot \rho"
          variables={[
            { name: '\\text{Deff}', desc: isVi ? 'Hệ số thiết kế, thể hiện mức tăng phương sai so với lấy mẫu ngẫu nhiên đơn giản cùng quy mô' : 'Ratio of the variance of cluster sampling to the variance of simple random sampling of the same size' },
            { name: '\\bar{M}', desc: isVi ? 'Kích thước trung bình của các cụm' : 'Average cluster size' },
            { name: '\\rho', desc: isVi ? 'Hệ số tương quan nội nhóm (Intraclass Correlation Coefficient - ICC), đo lường mức độ đồng nhất của các phần tử trong cụm' : 'Intraclass Correlation Coefficient (ICC). Ranges from 0 (heterogeneous) to 1 (perfectly homogeneous)' }
          ]}
        />

        {/* Formula 3: Sample Size Adjustment */}
        <FormulaCard
          title={isVi ? "3. Điều chỉnh Cỡ mẫu cho Lấy mẫu Cụm" : "3. Adjusted Sample Size for Clustering"}
          formula="n_{\text{adj}} = n_{\text{srs}} \cdot \text{Deff}"
          variables={[
            { name: 'n_{\\text{adj}}', desc: isVi ? 'Cỡ mẫu thực tế cần khảo sát đối với lấy mẫu cụm' : 'Required sample size adjusted for cluster design' },
            { name: 'n_{\\text{srs}}', desc: isVi ? 'Cỡ mẫu tính toán theo công thức ngẫu nhiên đơn giản tiêu chuẩn' : 'Sample size calculated using standard simple random sampling formulas' },
            { name: '\\text{Deff}', desc: isVi ? 'Hệ số thiết kế (luôn >= 1, thường dao động từ 1.5 đến 3 trong thực tế)' : 'Design effect (almost always >= 1, typically ranging from 1.5 to 3 in practical surveys)' }
          ]}
        />
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Mô phỏng Lấy mẫu Cụm trực quan" : "4. Interactive Cluster Simulator"} icon="🎮">
        <p>
          {isVi
            ? "Mô phỏng trực quan dưới đây chia quần thể thành 6 cụm có màu sắc khác nhau. Hãy dùng thanh trượt để chọn số cụm cần lấy (m) và nhấn 'Chọn cụm ngẫu nhiên' để xem hệ thống chọn trọn vẹn toàn bộ các hạt thuộc cụm được chỉ định."
            : "The simulator below divides a population into 6 color-coded clusters. Use the slider to set the number of clusters to sample (m) and click 'Select Clusters' to observe how all dots inside the selected cluster rings are selected simultaneously."}
        </p>
        <ClusterVisualizer />
      </Section>

      {/* Step by step */}
      <Section id="steps" title={isVi ? "5. Quy trình thực hiện từng bước" : "5. Step-by-Step Cluster Workflow"} icon="📋">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Comparison Table */}
      <Section id="comparison" title={isVi ? "6. So sánh chi tiết: Phân lớp vs. Cụm" : "6. Deep Comparison: Stratified vs. Cluster"} icon="⚖️">
        <p>
          {isVi
            ? "Đây là hai phương pháp dễ bị nhầm lẫn nhất trong lấy mẫu xác suất. Bảng dưới đây so sánh toàn diện các khía cạnh cơ bản giữa chúng."
            : "These two methods are often confused. The comparison table below highlights their differences across key operational and statistical dimensions."}
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
