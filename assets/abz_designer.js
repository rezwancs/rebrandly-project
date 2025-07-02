$('.abz-featured-product').each(function (i, section) {
  const imageGallery = $(section).find('.featured-product__img-wrapper');
  const imageThumbs = $(section).find('.abz-featured-thumbs');

  $(imageGallery).slick({
    asNavFor: $(imageThumbs),
    arrows: false,
    draggable: false
  });
  $(imageThumbs).slick({
    asNavFor: $(imageGallery),
    arrows: false,
    vertical: true,
    slidesToShow: 4,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          vertical: false,
        }
      }
    ]
  });
})

$('.product-option-selector-box input.productOption').change(function(e){
  const optionValueSpan = this.closest('.product-option-selector-box').querySelector('.abz-option-value');
  const newValue = this.title || this.value;
  newValue && optionValueSpan && (optionValueSpan.innerHTML = newValue);
});