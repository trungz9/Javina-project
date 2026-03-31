import { Link } from 'react-router-dom'
import Javina from "../assets/Javina-icon.png";
import pay1 from "../assets/pay_icon/1.PNG";
import pay2 from "../assets/pay_icon/2.PNG";
import pay3 from "../assets/pay_icon/3.PNG";
import pay4 from "../assets/pay_icon/4.PNG";
import pay5 from "../assets/pay_icon/5.PNG";
import ship1 from "../assets/ship/1.PNG";
import ship2 from "../assets/ship/2.PNG";
import ship3 from "../assets/ship/3.PNG";
import ship4 from "../assets/ship/4.PNG";
import ship5 from "../assets/ship/5.PNG";
import ship6 from "../assets/ship/6.PNG";
import ship7 from "../assets/ship/7.PNG";
import ship8 from "../assets/ship/8.PNG";
import ship9 from "../assets/ship/9.PNG";

const payImages = [pay1, pay2, pay3, pay4, pay5];
const shipImages = [ship1, ship2, ship3, ship4, ship5, ship6, ship7, ship8, ship9];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-header">
            <div className="footer-logo">
            <img src={Javina} alt="logo" className="logo-img" />
              <div className="footer-logo-title">Javina Shop</div>
            </div>
            <div className="footer-desc">
              Sàn thương mại điện tử cho người sinh sống tại Việt Nam - Nhật Bản.<br/>
              Mua bán — Trao đổi — Kết nối cộng đồng.
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Dịch vụ khách hàng</h4>
            {['Sản phẩm mới', 'Đăng bán', 'Giỏ hàng', 'Đơn hàng của tôi'].map(l => (
              <Link key={l} to="/" className="footer-link">{l}</Link>
            ))}
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Thanh Toán / Vận Chuyển</h4>

          {/* Thanh toán */}
          <div className="footer-subsection">
            <div className="footer-sale-ship">
            {payImages.map((img, i) => (
          <img key={i} src={img} className="footer-item-sale-ship" alt="pay" />
          ))}
          </div>
          </div>

        {/* Vận chuyển */}
          <div className="footer-subsection">
            <div className="footer-sale-ship">
            {shipImages.map((img, i) => (
          <img key={i} src={img} className="footer-item-sale-ship" alt="ship" />
          ))}
          </div>
          </div>
          </div>

          <div>
            <h4 className="footer-heading">Kết nối</h4>
            <div className="flex gap-12">
              {['📘','📸','🐦','▶️'].map((icon, i) => (
                <button key={i} className="footer-social-btn">{icon}</button>
              ))}
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © 2025 Javina Shop • Made with 🌸 for students
        </div>
      </div>
    </footer>
  )
}