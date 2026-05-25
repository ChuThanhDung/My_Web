# 🧠 TỔNG HỢP & GIẢI THÍCH TOÀN BỘ KIẾN THỨC: NAIVE BAYES CLASSIFIER

---

## 1. Bài toán Phân loại Thống kê (Statistical Classifier) là gì?

Hãy tưởng tượng bạn có một mẫu dữ liệu $x$ (ví dụ: thông tin một khách hàng, một bài báo, hoặc một email). Bạn cần xếp mẫu dữ liệu này vào một trong các nhóm (class) $k \in \{1, 2, ..., C\}$ (ví dụ: nhóm Quỵt nợ / Không quỵt nợ; Thể thao / Kinh tế; Spam / Không Spam).

* **Mục tiêu:** Tính xác suất để dữ liệu $x$ rơi vào lớp $k$, ký hiệu là $p(y=k|x)$ hoặc viết gọn là $p(k|x)$.
* **Quyết định:** Thống kê học nói rằng: Cái nào có xác suất xảy ra cao nhất thì ta chọn cái đó!
    $$y = \arg \max_{k \in \{1,...,C\}} p(k|x)$$

### 🔄 Cách tiếp cận bằng Định lý Bayes
Trong thực tế, tính trực tiếp $p(k|x)$ (Xác suất là lớp $k$ khi đã biết dữ liệu $x$) là **cực kỳ khó**. Vì vậy, ta dùng định lý Bayes để "lật ngược" bài toán:
$$p(k|x) = \frac{p(x|k)p(k)}{p(x)} \propto p(x|k)p(k)$$
*(Lưu ý: Ký hiệu $\propto$ nghĩa là "tỉ lệ thuận". Ta bỏ qua mẫu số $p(x)$ vì với mọi lớp $k$, dữ liệu đầu vào $x$ là như nhau, mẫu số không làm thay đổi thứ hạng lớn/nhỏ).*

**Ý nghĩa các đại lượng:**
* **$p(k)$ (Xác suất tiên nghiệm - Prior Probability):** Tỷ lệ xuất hiện của lớp $k$ trong tự nhiên. Tính dễ dàng bằng cách lấy: `(Số lượng mẫu thuộc lớp k) / (Tổng số mẫu)`.
* **$p(x|k)$ (Xác suất có điều kiện - Likelihood):** Nếu đã biết một mẫu thuộc lớp $k$, thì khả năng mẫu đó có các đặc trưng giống như $x$ là bao nhiêu?

---

## 2. Giả thiết "Ngây thơ" (Naive's Assumption) là gì?

Nếu vector dữ liệu $x$ có rất nhiều chiều (nhiều thuộc tính) $x = (x_1, x_2, ..., x_d)^T$, việc tính $p(x|k)$ là bất khả thi vì không thể tìm đủ dữ liệu bao hàm tất cả các tổ hợp thuộc tính cùng lúc.

Để giải quyết, ta đưa ra một giả thiết **"Ngây thơ" (Naive)**: **Coi như tất cả các thuộc tính $x_i$ hoàn toàn độc lập với nhau trong cùng một lớp $k$.**

Nhờ sự độc lập này, xác suất của một tích bằng tích các xác suất:
$$p(x|k) = p(x_1, x_2, ..., x_d|k) = \prod_{i=1}^{d} p(x_i|k)$$

> 💡 **Tại sao gọi là ngây thơ?** Vì thực tế các thuộc tính thường liên quan đến nhau. Ví dụ: Nếu một email có từ *"Trúng thưởng"*, khả năng cao nó cũng sẽ có từ *"Triệu USD"*. Hai từ này không độc lập. Nhưng thực tế chứng minh, dù giả thiết này "sai" so với thực tế, mô hình Naive Bayes vẫn chạy **rất nhanh** và cho kết quả **chính xác kinh ngạc** trên tập dữ liệu lớn (Large scale).

### 🛠️ Tránh lỗi tràn số bé (Underflow) với hàm Log
Vì các $p(x_i|k)$ là các xác suất (nhỏ hơn 1), khi nhân hàng ngàn xác suất nhỏ với nhau, máy tính sẽ trả về một số siêu nhỏ tiến về 0 (gây sai số máy tính). Do đó, người ta chuyển phép **Nhân** thành phép **Cộng** bằng cách lấy $log$:
$$y = \arg \max_{k \in \{1,...,C\}} \left( \log(p(k)) + \sum_{i=1}^{d} \log(p(x_i|k)) \right)$$

---

## 3. Ba "Biến thể" của Naive Bayes dựa vào Kiểu dữ liệu

Tùy thuộc vào đặc trưng $x_i$ của bạn là loại dữ liệu gì, ta sẽ có công thức tính $p(x_i|k)$ tương ứng:

| Biến thể Naive Bayes | Kiểu dữ liệu của thuộc tính $x_i$ | Ví dụ |
| :--- | :--- | :--- |
| **Multinomial Naive Bayes** | Dạng phân loại, nhiều lựa chọn (Đếm tần suất) | Nhóm máu (A, B, O, AB), Số lần từ xuất hiện trong văn bản. |
| **Bernoulli Naive Bayes** | Dạng Nhị phân (Chỉ có 2 trạng thái 0 hoặc 1) | Giới tính (Nam/Nữ), Từ vựng (Có xuất hiện / Không xuất hiện). |
| **Gaussian Naive Bayes** | Dạng số thực liên tục | Chiều cao, Cân nặng, Điểm số, độ pH. |

### 🔹 3.1. Multinomial Naive Bayes & Kỹ thuật Laplace Smoothing
Công thức gốc tính xác suất từ $x_i$ xuất hiện trong lớp $k$:
$$p(x_i|k) = \frac{\text{Số mẫu trong lớp } k \text{ có thuộc tính bằng } x_i}{\text{Tổng số mẫu trong lớp } k}$$

⚠️ **Thảm họa xác suất bằng 0:** Nếu trong tập huấn luyện (Training set), lớp $k$ chưa bao giờ nhìn thấy thuộc tính $x_i$, thì $p(x_i|k) = 0$. Khi nhân vào công thức tổng, nó sẽ **Xóa sạch** công sức của các thuộc tính khác, khiến xác suất của lớp đó bằng 0 một cách vô lý.

🛡️ **Giải pháp - Laplace Smoothing (Làm mịn Laplace):** Cộng thêm một lượng nhỏ vào cả tử và mẫu để đảm bảo không có xác suất nào bằng 0:
$$\hat{\lambda}_{ki} = p(x_i|k) \approx \frac{\text{Số mẫu lớp } k \text{ có thuộc tính } x_i + \alpha}{\text{Tổng số mẫu lớp } k + c \cdot \alpha}$$
*(Thường chọn $\alpha = 1$, $c$ là số lượng lựa chọn có thể có của thuộc tính đó).*

### 🔹 3.2. Bernoulli Naive Bayes
Áp dụng khi dữ liệu chỉ có dạng $0$ hoặc $1$ (Có hoặc Không). Công thức gộp cho cả 2 trường hợp:
$$p(x_i|k) = (P_{i,k})^{x_i} (1 - P_{i,k})^{(1 - x_i)}$$
* Nếu $x_i = 1$, biểu thức trở thành $P_{i,k}$ (Xác suất có xuất hiện).
* Nếu $x_i = 0$, biểu thức trở thành $1 - P_{i,k}$ (Xác suất không xuất hiện).

### 🔹 3.3. Gaussian Naive Bayes (Dữ liệu số thực)
Vì dữ liệu là số thực liên tục, ta không thể "đếm" tần suất được. Ta giả định dữ liệu thuộc tính $x_i$ trong lớp $k$ tuân theo **Phân phối chuẩn (Gaussian)** dạng hình chuông ngược, đặc trưng bởi giá trị trung bình $\mu_{ki}$ và phương sai $\sigma^2_{ki}$.



[Image of Gaussian distribution curve]


Xác suất được tính bằng hàm mật độ:
$$p(x_i|k) = \frac{1}{\sqrt{2\pi\sigma^2_{ki}}} \exp\left( -\frac{(x_i - \mu_{ki})^2}{2\sigma^2_{ki}} \right)$$
* $\mu_{ki}$: Trung bình cộng của thuộc tính $i$ trong các mẫu thuộc lớp $k$.
* $\sigma^2_{ki}$: Phương sai (độ lệch) của thuộc tính $i$ trong các mẫu thuộc lớp $k$.

---

## 4. Ứng dụng Phân loại Văn bản (Document Classification)

Đây là ứng dụng kinh điển nhất của Naive Bayes. Có 2 cách biểu diễn văn bản:

1.  **Mô hình Bag of Words (Túi từ) + Multinomial NB:** Ta quan tâm một từ xuất hiện **bao nhiêu lần** trong văn bản.
    * $N_{ci}$: Tổng số lần từ $i$ xuất hiện trong toàn bộ các văn bản thuộc lớp $c$.
    * $N_c$: Tổng số từ (tính cả lặp) của tất cả văn bản thuộc lớp $c$.
    * Áp dụng Laplace Smoothing: $\hat{\lambda}_{ci} = \frac{N_{ci} + \alpha}{N_c + d\alpha}$ ($d$ là số từ trong từ điển).
2.  **Mô hình Nhị phân + Bernoulli NB:** Ta chỉ quan tâm từ đó **có xuất hiện hay không** (1 hoặc 0), không cần biết xuất hiện bao nhiêu lần.

---

## 5. Giải thích Ví dụ 1 chi tiết (Phân loại Email Spam)

Bài toán yêu cầu phân loại Email $E_4$ là **Spam (S)** hay **Not Spam (N)** dựa trên từ điển gồm 7 từ $[w_1, w_2, w_3, w_4, w_5, w_6, w_7]$.

### Bước 1: Tính xác suất tiên nghiệm $P(k)$
Tập huấn luyện có 3 email ($E_1, E_2, E_3$), trong đó có 1 email là Spam, 2 email là Not Spam.
* $P(S) = \frac{1}{3}$
* $P(N) = \frac{2}{3}$

### Bước 2: Thống kê và Tính toán với Laplace Smoothing ($\alpha = 1$)
Khi xét email mới $E_4$, ta tính tích xác suất của các từ xuất hiện trong $E_4$:

* **Nếu $E_4$ là Spam (S):**
    $$P(S|E_4) \propto P(S) \times \prod P(w_i|S) = \frac{1}{3} \times \left( \frac{2}{12} \times \frac{1}{12} \times ... \right) \propto 0.0046$$
* **Nếu $E_4$ là Not Spam (N):**
    $$P(N|E_4) \propto P(N) \times \prod P(w_i|N) = \frac{2}{3} \times \left( \frac{2}{17} \times \frac{2}{17} \times ... \right) \propto 0.0092$$

### Bước 3: Chuẩn hóa xác suất về dạng % (Tỷ lệ phần trăm)
Tổng giá trị đại diện là: $0.0046 + 0.0092 = 0.0138$.
* Xác suất thực sự là Spam: $P(S|E_4) = \frac{0.0046}{0.0138} \approx 0.334$ (tức **33.4%**)
* Xác suất thực sự là Not Spam: $P(N|E_4) = \frac{0.0092}{0.0138} \approx 0.666$ (tức **66.6%**)

🏆 **Kết luận:** Vì $66.6\% > 33.4\%$, thuật toán quyết định phân loại email $E_4$ là **Not Spam (N)**.

---
*Tài liệu học tập dựa trên bài giảng Machine Learning - HUS.*