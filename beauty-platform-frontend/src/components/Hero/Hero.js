import "./Hero.css";
import heroImg from "../../assets/images/img1.jpg";

function Hero(){

return(

<section id="hero">

<div className="wrap hero-inner">

<div className="hero-content">

<span className="hero-pill">

Premium Beauty Experience

</span>

<h1>

Luxury Beauty  
<span>Salon & Store</span>

</h1>

<p>

Professional beauty services and premium cosmetics
delivered with luxury salon experience.

</p>

<div className="hero-buttons">

<button className="btn btn-r">

Book Service

</button>

<button className="btn btn-o">

Shop Products

</button>

</div>

<div className="hero-stats">

<div>

<h3>4.9★</h3>

<span>Customer Rating</span>

</div>

<div>

<h3>10k+</h3>

<span>Clients Served</span>

</div>

</div>

</div>

<div className="hero-image">

<img src={heroImg} alt="Beauty"/>

</div>

</div>

</section>

)

}

export default Hero;