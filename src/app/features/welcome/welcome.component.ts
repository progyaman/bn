import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperRef') swiperRef!: ElementRef;

  slides = [
    { image: 'assets/welcome/sh1.jpg', title: 'جمال جعفر آل إبراهيم التميمي' },
    { image: 'assets/welcome/sh2.jpg', title: 'شهيد الواجب' },
    { image: 'assets/welcome/sh3.jpg', title: 'سلام عبد الزهرة الديراوي' },
    { image: 'assets/welcome/sh4.jpg', title: 'علي المنصوري' },
    { image: 'assets/welcome/sh5.jpg', title: 'أحمد المحمودي' },
    { image: 'assets/welcome/sh6.jpg', title: 'شهيد الوطن' },
    { image: 'assets/welcome/sh7.jpg', title: 'باسم كاظم كحيط' },
    { image: 'assets/welcome/sh8.jpg', title: 'منير راضي' },
    { image: 'assets/welcome/sh9.jpg', title: 'بطل من أبطالنا' },
    { image: 'assets/welcome/sh10.jpg', title: 'شهيد العراق' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const swiperEl = this.swiperRef.nativeElement;

    const swiperParams = {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 30,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        reverseDirection: true
      },
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: false,
      },
      scrollbar: {
        draggable: true,
      },
      loop: true,
      on: {
        init: () => {
          console.log('Swiper initialized');
        },
      },
    };

    Object.assign(swiperEl, swiperParams);
    swiperEl.initialize();
  }
}
