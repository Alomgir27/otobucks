import React from "react";

let CarouselCom = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  return (
    <div style={{ width: "100%" }}>
        <h1>ds</h1>
      {/* <Carousel
        responsive={responsive}
        swipeable={false}
        draggable={false}
        showDots={true}
        ssr={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        <img src="https://pngimg.com/uploads/credit_card/credit_card_PNG118.png" className="_slider_img"/>
        <img src="https://www.vhv.rs/dpng/d/17-175718_credit-card-hd-png-download.png" className="_slider_img"/>
      </Carousel> */}
    </div>
  );
};
export default CarouselCom;
