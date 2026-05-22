import { useTranslation } from 'react-i18next';
import { Section, ComparisonTable, CommonMistakes, SummaryCard, StepGuide, InfoBox } from '../sampling/SamplingSharedComponents';
import SqlVisualizer from './SqlVisualizer';

export default function SqlContent() {
  const { i18n } = useTranslation();
  const isVi = i18n.language.startsWith('vi');

  // Steps
  const stepsEn = [
    { title: 'Schema Audit & Null Density Check', desc: 'Query the table metadata. Count missing entries across key metrics (e.g. SELECT COUNT(*), SUM(CASE WHEN age IS NULL THEN 1 ELSE 0 END)).' },
    { title: 'String Uniformity (TRIM / LOWER)', desc: 'Standardize text columns. Wrap name inputs in TRIM() to discard spaces and LOWER() to ensure case-insensitive matches.' },
    { title: 'Null Imputation via COALESCE', desc: 'Ensure arithmetic operations do not break by filling missing numbers/strings (e.g., COALESCE(salary, 0) or COALESCE(status, \'active\')).' },
    { title: 'Deduplication (DISTINCT / ROW_NUMBER)', desc: 'Isolate unique records. Use SELECT DISTINCT for full-row duplicates, or ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) for partial matches.' },
    { title: 'Data Pipeline Writing (Views / CTEs)', desc: 'Store your cleaned SQL logic as a database VIEW or Common Table Expression (CTE) so other analysis scripts can access it directly.' }
  ];

  const stepsVi = [
    { title: 'Đánh giá Lược đồ & Tỷ lệ Null', desc: 'Kiểm tra cấu trúc bảng. Đếm số lượng ô rỗng ở các cột quan trọng (ví dụ: SELECT COUNT(*), SUM(CASE WHEN age IS NULL THEN 1 ELSE 0 END)).' },
    { title: 'Thống nhất Chuỗi văn bản (TRIM / LOWER)', desc: 'Chuẩn hóa định dạng văn bản. Dùng hàm TRIM() để cắt khoảng trắng thừa và LOWER() để tránh phân biệt chữ hoa/thường.' },
    { title: 'Điền dữ liệu khuyết bằng COALESCE', desc: 'Tránh lỗi tính toán toán học bằng cách thay thế NULL bằng giá trị mặc định tương ứng thông qua hàm COALESCE().' },
    { title: 'Loại bỏ trùng lặp (DISTINCT / ROW_NUMBER)', desc: 'Lọc bản ghi độc nhất. Sử dụng SELECT DISTINCT cho trùng lặp toàn dòng, hoặc ROW_NUMBER() phân nhóm cho trùng lặp theo thời gian.' },
    { title: 'Đóng gói Kịch bản (VIEW / CTE)', desc: 'Lưu trữ logic làm sạch dữ liệu dưới dạng VIEW hoặc CTE để các nhà phân tích hay script Python/R sau đó có thể tái sử dụng sạch sẽ.' }
  ];

  // Common mistakes
  const mistakesEn = [
    {
      mistake: 'Assuming SQL math operations work normally with NULL values (e.g., salary + bonus).',
      fix: 'In SQL, any arithmetic operation with NULL results in NULL (e.g., 5000 + NULL = NULL). Always use COALESCE to handle null values first (e.g., COALESCE(salary, 0) + COALESCE(bonus, 0)).'
    },
    {
      mistake: 'Using heavy row-by-row CURSORS or loops in SQL scripts.',
      fix: 'SQL is fundamentally a set-based language. Avoid loops; instead, write declarative set operations (joins, CTEs, filters) which are highly optimized by database planner engines.'
    }
  ];

  const mistakesVi = [
    {
      mistake: 'Nghĩ rằng các phép toán cộng trừ nhân chia trong SQL hoạt động bình thường với giá trị NULL.',
      fix: 'Trong SQL, bất kỳ phép toán nào thực hiện với NULL đều trả về NULL (ví dụ: 5000 + NULL = NULL). Hãy luôn bọc biến số bằng hàm COALESCE trước khi tính toán (ví dụ: COALESCE(salary, 0) + COALESCE(bonus, 0)).'
    },
    {
      mistake: 'Sử dụng vòng lặp từng dòng (CURSOR) nặng nề trong cơ sở dữ liệu.',
      fix: 'SQL về bản chất là ngôn ngữ xử lý theo tập hợp (set-based). Tránh dùng vòng lặp; hãy viết các truy vấn khai báo (CTEs, JOINs, GROUP BY) để bộ tối ưu hóa truy vấn thực thi song song.'
    }
  ];

  // Comparison Table
  const tableHeadersEn = ['Pre-processing Tool', 'SQL Database Engine', 'Python Pandas DataFrame', 'Microsoft Excel Sheet'];
  const tableRowsEn = [
    ['Data Scale Limit', 'Petabytes (limited only by disk arrays / cloud scale)', 'Gigabytes (strictly limited by local computer RAM)', '1,048,576 rows maximum'],
    ['Processing Speed', 'Extremely fast for server-side filtering & aggregation', 'Fast (in-memory execution, vector operations)', 'Slow on heavy sheets; freezes easily'],
    ['Storage Location', 'Directly inside secure server database tables', 'Temporary memory variables (lost when script exits)', 'Standalone files on local drives'],
    ['Collaboration', 'Centralized; multiple analysts query the same view', 'Versioned scripts (git), but local runtime environments vary', 'High manual edits; difficult version control'],
    ['Primary Advantage', 'Cleans data at source; reduces network transfer payload', 'Rich mathematical transformations & AI model piping', 'Intuitive point-and-click edits for business stakeholders']
  ];

  const tableHeadersVi = ['Công cụ tiền xử lý', 'Cơ sở dữ liệu SQL', 'Python Pandas DataFrame', 'Microsoft Excel Sheet'];
  const tableRowsVi = [
    ['Giới hạn quy mô dữ liệu', 'Hàng Petabyte (chỉ giới hạn bởi ổ đĩa lưu trữ / đám mây)', 'Hàng Gigabyte (bị giới hạn nghiêm ngặt bởi RAM vật lý)', 'Tối đa 1,048,576 dòng dữ liệu'],
    ['Tốc độ xử lý', 'Cực nhanh nhờ công cụ lập chỉ mục (index) và tối ưu hóa máy chủ', 'Nhanh (xử lý trực tiếp trên RAM, tính toán song song vector)', 'Chậm khi xử lý tệp nặng; dễ bị đơ/phóng đại bộ nhớ'],
    ['Lưu trữ & Bảo mật', 'Lưu trữ tập trung, phân quyền truy cập chặt chẽ', 'Biến nhớ tạm thời trên RAM (mất đi khi tắt chương trình)', 'Lưu tệp cục bộ (.xlsx); dễ rò rỉ hoặc hỏng tệp'],
    ['Hợp tác đội ngũ', 'Tập trung; nhiều người cùng truy vấn một cấu trúc View dữ liệu', 'Quản lý qua git, nhưng phụ thuộc cấu hình máy chạy', 'Sửa đổi thủ công; khó theo dõi lịch sử chỉnh sửa'],
    ['Lợi thế lớn nhất', 'Làm sạch ngay tại nguồn; giảm thiểu băng thông truyền tải dữ liệu', 'Phục vụ trực tiếp cho mô hình AI và xử lý toán phức tạp', 'Giao diện trực quan; thích hợp cho báo cáo kinh doanh nhanh']
  ];

  // Summary bullets
  const summaryEn = [
    'SQL is the foundational skill required to access, clean, and filter raw enterprise data at the source.',
    'Common data issues like duplicate rows, trailing spaces, and mismatched cases can be solved in a single query utilizing TRIM, LOWER, and DISTINCT.',
    'Arithmetic operations with NULL yield NULL; always wrap nullable columns in COALESCE to supply fallback defaults.',
    'Cleansed SQL tables should be compiled into VIEWs or CTEs to pipeline directly into Python/R or BI dashboards (PowerBI, Tableau).'
  ];

  const summaryVi = [
    'SQL là kỹ năng nền tảng bắt buộc để truy cập, làm sạch và lọc dữ liệu thô ngay tại nguồn lưu trữ của doanh nghiệp.',
    'Các lỗi dữ liệu phổ biến như khoảng trắng thừa, chữ hoa thường hỗn loạn, trùng lặp dòng đều có thể giải quyết nhanh chóng bằng TRIM, LOWER và DISTINCT.',
    'Mọi phép toán số học với NULL đều cho kết quả NULL; luôn sử dụng COALESCE để thiết lập các giá trị mặc định dự phòng.',
    'Dữ liệu sau khi làm sạch bằng SQL nên được đóng gói dưới dạng VIEW hoặc CTE để cung cấp cho mô hình Python/R hoặc dashboard BI.'
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <Section id="overview" title={isVi ? "1. Tổng quan & Định nghĩa" : "1. Overview & Definition"} icon="🗄️" accentColor="#0ea5e9">
        <p>
          {isVi
            ? "Trong thực tế công nghiệp, hơn 80% thời gian của một dự án phân tích dữ liệu được dành cho việc thu thập, làm sạch và chuẩn hóa dữ liệu thô. Và SQL (Structured Query Language) chính là ngôn ngữ phổ quát, là chốt chặn đầu tiên giúp lọc bỏ rác dữ liệu ngay tại nguồn lưu trữ cơ sở dữ liệu."
            : "In industrial data science, over 80% of project time is spent collecting, cleaning, and standardizing raw datasets. SQL (Structured Query Language) serves as the universal interface and the first line of defense, filtering out data anomalies directly inside database storage engines."}
        </p>
        <p>
          {isVi
            ? "Dữ liệu thô trong cơ sở dữ liệu doanh nghiệp thường chứa đầy các khoảng trắng thừa do người dùng nhập liệu, định dạng chữ viết hoa thường lộn xộn, các bản ghi bị nhân bản do lỗi kết nối, hoặc nghiêm trọng hơn là các giá trị trống (NULL). Phân tích thống kê hoặc chạy mô hình ML trực tiếp trên nguồn dữ liệu bẩn này chắc chắn sẽ dẫn đến kết quả sai lệch nghiêm trọng."
            : "Raw transactional databases are frequently contaminated with leading/trailing spaces from user forms, mismatched text casing, duplicate database records, and missing values (NULL). Performing stats analyses or training machine learning models on dirty data inevitably leads to distorted, invalid insights."}
        </p>
      </Section>

      {/* Importance & Use Cases */}
      <Section id="purpose" title={isVi ? "2. Vai trò & Nguyên tắc Đẩy tính toán (Query Pushdown)" : "2. Importance & Query Pushdown Principle"} icon="⚡" accentColor="#0ea5e9">
        <p>
          {isVi
            ? "Tại sao chúng ta phải viết truy vấn SQL để làm sạch dữ liệu thay vì tải toàn bộ về Excel hoặc Python? Câu trả lời nằm ở quy mô dữ liệu và hiệu năng mạng. Cơ sở dữ liệu doanh nghiệp có thể nặng hàng trăm GB hoặc hàng TB. Việc tải toàn bộ dữ liệu thô qua đường truyền mạng về máy tính cá nhân để xử lý bằng Excel sẽ gây nghẽn mạng và làm sập bộ nhớ máy tính."
            : "Why clean data using SQL queries instead of pulling the entire dataset into Excel or Python? The answer lies in data scale and network efficiency. Production databases often hold hundreds of gigabytes or terabytes of records. Downloading raw, unfiltered files over the network to a local Excel sheet will saturate bandwidth and crash system RAM."}
        </p>
        <InfoBox variant="tip">
          <strong className="block text-sky-500 mb-1">
            {isVi ? "Triết lý Query Pushdown (Đẩy tính toán xuống máy chủ)" : "The Query Pushdown Philosophy"}
          </strong>
          <span>
            {isVi
              ? "Bằng cách thực hiện các câu lệnh TRIM, CASE WHEN, COALESCE và FILTER ngay trong truy vấn SQL, chúng ta tận dụng tối đa sức mạnh phần cứng của máy chủ cơ sở dữ liệu. Dữ liệu được làm sạch và thu gọn tại chỗ, máy tính của nhà phân tích chỉ cần tải về kết quả tinh gọn cuối cùng (giảm dung lượng truyền tải tới 99%)."
              : "By executing TRIM, CASE WHEN, COALESCE, and filters directly within the SQL query, we push computing down to the database engine. The data is cleaned at the source, and the analyst's local machine only downloads the finalized, lightweight output (reducing network payload by up to 99%)."}
          </span>
        </InfoBox>
      </Section>

      {/* Technical Focus */}
      <Section id="math" title={isVi ? "3. Hàm Xử lý NULL & Chuẩn hóa văn bản" : "3. Technical Focus: Nulls & String Standardization"} icon="⚙️" accentColor="#0ea5e9">
        <p>
          {isVi
            ? "Trong SQL, giá trị NULL biểu thị trạng thái dữ liệu bị khuyết (unknown). Nó hoàn toàn khác với số 0 hay một chuỗi rỗng. Điểm mấu chốt của xử lý dữ liệu thô là quản lý các giá trị khuyết này một cách khoa học để không phá hỏng các công thức tính toán phía sau."
            : "In SQL, a NULL value represents missing or unknown data. It is fundamentally different from a zero or an empty string. A primary goal in raw data management is properly handling null values to prevent downstream calculation failures."}
        </p>

        <InfoBox variant="tip">
          <strong className="block text-sky-500 mb-1">
            {isVi ? "Cơ chế hoạt động của hàm COALESCE()" : "Understanding COALESCE() Mechanics"}
          </strong>
          <span>
            {isVi
              ? "Hàm COALESCE(value1, value2, ..., default_value) sẽ duyệt từ trái qua phải và trả về giá trị khác NULL đầu tiên mà nó gặp. Ví dụ: COALESCE(age, 30) sẽ giữ nguyên tuổi của người dùng, nhưng nếu tuổi bị khuyết (NULL), nó sẽ điền giá trị trung vị mặc định là 30."
              : "The COALESCE(val1, val2, ..., default) function evaluates its arguments from left to right and returns the first non-NULL value. For example, COALESCE(age, 30) returns the user's actual age if present, but falls back to a default value of 30 if age is NULL."}
          </span>
        </InfoBox>
      </Section>

      {/* Simulator */}
      <Section id="simulator" title={isVi ? "4. Bộ mô phỏng Sandbox Làm sạch Dữ liệu bằng SQL" : "4. Interactive SQL Data Cleaning Sandbox"} icon="🎮" accentColor="#0ea5e9">
        <p>
          {isVi
            ? "Dưới đây là một bộ dữ liệu thô chứa đầy lỗi nhập liệu thực tế. Hãy chọn các kịch bản truy vấn SQL làm sạch dữ liệu và quan sát bảng kết quả chuyển đổi."
            : "Below is a raw dataset reflecting real-world form entry errors. Select one of the cleaning SQL query scenarios to run it in the Sandbox."}
        </p>
        <SqlVisualizer />
      </Section>

      {/* Steps */}
      <Section id="steps" title={isVi ? "5. Quy trình Làm sạch Dữ liệu bằng SQL" : "5. Database Cleaning Workflow"} icon="📋" accentColor="#0ea5e9">
        <StepGuide steps={isVi ? stepsVi : stepsEn} />
      </Section>

      {/* Mistakes */}
      <Section id="mistakes" title={isVi ? "6. Sai lầm truy vấn cần tránh" : "6. Common SQL Anti-patterns"} icon="❌" accentColor="#0ea5e9">
        <CommonMistakes items={isVi ? mistakesVi : mistakesEn} />
      </Section>

      {/* Comparison */}
      <Section id="comparison" title={isVi ? "7. So sánh SQL với Pandas & Excel" : "7. SQL vs Pandas vs Excel Comparison Matrix"} icon="⚖️" accentColor="#0ea5e9">
        <p>
          {isVi
            ? "Bảng dưới đây so sánh thế mạnh của SQL với các công cụ tiền xử lý dữ liệu phổ biến khác."
            : "The comparison matrix below highlights the performance boundaries of SQL against other pre-processing methods."}
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
