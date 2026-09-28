import svgPaths from "./svg-wzto9x89md";
import { imgVector, imgVector1 } from "./svg-3dyzj";

function Paragraph() {
  return (
    <div className="absolute h-[22px] left-[29.01px] top-px w-[36.463px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] left-[18.5px] text-[#0d0d0d] text-[17px] text-center top-[-0.2px]" style={{ fontVariationSettings: "\'wdth\' 100" }}>
        9:41
      </p>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute h-[22px] left-[16px] top-[21px] w-[94.5px]" data-name="Container">
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[12.225px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_4%_5.95%_0]" data-name="Cellular Connection">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.432 11.4975">
          <path clipRule="evenodd" d={svgPaths.p19b79900} fill="var(--fill-0, #0D0D0D)" fillRule="evenodd" id="Cellular Connection" />
        </svg>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col h-[12.225px] items-start left-[8.41px] top-[5.39px] w-[19.2px]" data-name="Container">
      <Icon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[12.325px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[0_4.77%_5.17%_0]" data-name="Wifi">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.3203 11.6882">
          <path clipRule="evenodd" d={svgPaths.p7fc5f00} fill="var(--fill-0, #0D0D0D)" fillRule="evenodd" id="Wifi" />
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[12.325px] items-start left-[34.61px] top-[5.34px] w-[17.138px]" data-name="Container">
      <Icon1 />
    </div>
  );
}

function Battery() {
  return (
    <div className="absolute contents inset-[3.85%_2.4%_3.85%_1.79%]" data-name="Battery">
      <div className="absolute inset-[3.85%_12.5%_3.85%_1.79%]" data-name="Border">
        <div className="absolute inset-[-4.12%_-2.11%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.4093 12.9879">
            <path d={svgPaths.p2b49e300} id="Border" opacity="0.35" stroke="var(--stroke-0, #0D0D0D)" strokeWidth="0.987873" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[36.78%_2.4%_31.87%_92.86%]" data-name="Cap">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.29598 4.07547">
          <path d={svgPaths.p33289900} fill="var(--fill-0, #0D0D0D)" id="Cap" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute inset-[15.38%_17.86%_15.38%_7.14%]" data-name="Capacity">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4938 9">
          <path d={svgPaths.p24620a00} fill="var(--fill-0, #0D0D0D)" id="Capacity" />
        </svg>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[13px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Battery />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[13px] items-start left-[58.75px] top-[5px] w-[27.325px]" data-name="Container">
      <Icon2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[22px] left-[264.5px] top-[21px] w-[94.5px]" data-name="Container">
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[62px] left-[348.5px] top-0 w-[375px]" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function WeuiArrowOutlined() {
  return (
    <div className="absolute contents inset-[27.04%_16.51%_22.96%_16.82%]" data-name="weui:arrow-outlined">
      <div className="absolute inset-[27.04%_16.51%_22.96%_16.82%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99998 15">
          <path d={svgPaths.p2b16c000} fill="var(--fill-0, #0F0F10)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="h-[30px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <WeuiArrowOutlined />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[30px] items-start left-0 top-0 w-[15px]" data-name="Container">
      <Icon3 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[30px] left-[14px] top-[7px] w-[15px]" data-name="Container">
      <Container9 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute bg-[#ffdecf] left-0 rounded-[8px] size-[44px] top-0" data-name="Container">
      <Container8 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[22px] left-[125px] top-[11px] w-[99.9px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Outfit:Regular',sans-serif] font-normal leading-[22px] left-[50px] text-[20px] text-black text-center top-[-0.4px]">Dashboard</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[44px] left-[16px] top-[64px] w-[224.9px]" data-name="Container">
      <Container7 />
      <Paragraph1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[22px] left-[127.74px] top-[14px] w-[87.513px]" data-name="Paragraph">
      <p className="absolute font-['Outfit:Regular',sans-serif] font-normal leading-[22px] left-0 text-[#fcfcfc] text-[16px] top-[-0.2px]">View Details</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#e95322] h-[50px] left-[16px] rounded-[32px] top-0 w-[343px]" data-name="Container">
      <Paragraph2 />
    </div>
  );
}

function Container14() {
  return <div className="bg-[#0d0d0d] h-[5px] rounded-[100px] shrink-0 w-[144px]" data-name="Container" />;
}

function Container13() {
  return (
    <div className="absolute content-stretch flex h-[5px] items-center justify-center left-[116px] top-[13px] w-[144px]" data-name="Container">
      <Container14 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute h-[26px] left-0 top-[58px] w-[375px]" data-name="Container">
      <Container13 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute h-[84px] left-0 top-[1561px] w-[375px]" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute bottom-[8.33%] contents left-1/4 right-1/4 top-[8.33%]" data-name="Icon">
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%_-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.99997 22">
            <path d="M0.999985 0.999985V21" id="Vector" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[20.83%] left-1/4 right-1/4 top-[20.83%]" data-name="Vector_2">
        <div className="absolute inset-[-7.14%_-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
            <path d={svgPaths.pe976417} id="Vector_2" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon5 />
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[11.99px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(0,168,107,0.13)] left-0 rounded-[20px] size-[47.987px] top-0" data-name="Container">
      <Container18 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute contents inset-[29.15%_8.37%_29.2%_8.33%]" data-name="Icon">
      <div className="absolute inset-[29.15%_8.37%_45.86%_66.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10.654px_-4.661px] mask-size-[15.981px_15.981px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.3268 5.32687">
            <path d={svgPaths.p10e8b980} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.15%_8.37%_29.2%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.332px_-4.661px] mask-size-[15.981px_15.981px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6488 7.99026">
            <path d={svgPaths.p6c9a800} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[0_0.04%_0.04%_0]" data-name="Clip path group">
      <Icon7 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="h-[15.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[15.988px] top-[3.99px]" data-name="Container">
      <Icon6 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#008236] text-[16px] top-[-0.2px]">12.5%</p>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.975px] items-start left-[19.96px] pr-[-0.013px] pt-[1.725px] top-0 w-[47.987px]" data-name="Container">
      <Paragraph3 />
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[#dcfce7] h-[23.975px] left-[275.02px] rounded-[16px] top-0 w-[67.975px]" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[47.987px] left-0 top-0 w-[343px]" data-name="Container">
      <Container17 />
      <Container19 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[33.6px] left-0 top-[51.71px] w-[71.725px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[20px] top-[-0.4px]">$45,231</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[343px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[14px] top-[-0.8px]">Total Revenue</p>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute h-[25.563px] left-0 top-[81.57px] w-[343px]" data-name="Container">
      <Paragraph5 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white h-[107px] left-[16px] rounded-[16px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[133.75px] w-[343px]" data-name="Container">
      <Container16 />
      <Paragraph4 />
      <Container22 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99997 5.99997">
            <path d={svgPaths.p92ebb00} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector_2">
        <div className="absolute inset-[-1px_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.794 1.99997">
            <path d="M0.999985 0.999985H18.794" id="Vector_2" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector_3">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
            <path d={svgPaths.p1e55f280} id="Vector_3" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon9 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[11.99px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Container25() {
  return (
    <div className="absolute bg-[rgba(59,130,246,0.13)] left-0 rounded-[20px] size-[47.987px] top-0" data-name="Container">
      <Container26 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute contents inset-[29.15%_8.37%_29.2%_8.33%]" data-name="Icon">
      <div className="absolute inset-[29.15%_8.37%_45.86%_66.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10.654px_-4.661px] mask-size-[15.981px_15.981px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.3268 5.32687">
            <path d={svgPaths.p10e8b980} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.15%_8.37%_29.2%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.332px_-4.661px] mask-size-[15.981px_15.981px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6488 7.99026">
            <path d={svgPaths.p6c9a800} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[0_0.04%_0.04%_0]" data-name="Clip path group">
      <Icon11 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[15.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup1 />
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[15.988px] top-[3.99px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#008236] text-[16px] top-[-0.2px]">8.3%</p>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.975px] items-start left-[19.96px] pr-[-0.612px] pt-[1.725px] top-0 w-[38.388px]" data-name="Container">
      <Paragraph6 />
    </div>
  );
}

function Container27() {
  return (
    <div className="absolute bg-[#dcfce7] h-[23.975px] left-[284.63px] rounded-[16px] top-0 w-[58.375px]" data-name="Container">
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute h-[48px] left-0 top-[0.24px] w-[343px]" data-name="Container">
      <Container25 />
      <Container27 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[33.6px] left-0 top-[51.73px] w-[59.237px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[24px] top-[-0.6px]">1,465</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[361.837px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[16px] top-[-0.4px]">Total Orders</p>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute h-[25.563px] left-0 top-[81.6px] w-[361.837px]" data-name="Container">
      <Paragraph8 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white h-[107px] left-[16px] rounded-[16px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[264.75px] w-[343px]" data-name="Container">
      <Container24 />
      <Paragraph7 />
      <Container30 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute contents inset-[12.5%_8.33%]" data-name="Icon">
      <div className="absolute inset-[62.5%_33.33%_12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 7.99997">
            <path d={svgPaths.p3dfa8200} id="Vector" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[13.03%_20.85%_54.7%_66.67%]" data-name="Vector_2">
        <div className="absolute inset-[-12.92%_-33.38%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.99641 9.74442">
            <path d={svgPaths.pa40c380} id="Vector_2" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[63.04%_8.33%_12.5%_79.17%]" data-name="Vector_3">
        <div className="absolute inset-[-17.04%_-33.33%_-17.04%_-33.34%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.00021 7.87021">
            <path d={svgPaths.p29e1c100} id="Vector_3" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_45.83%_54.17%_20.83%]" data-name="Vector_4">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99997 9.99997">
            <path d={svgPaths.p35de400} id="Vector_4" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon13 />
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[11.99px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Container33() {
  return (
    <div className="absolute bg-[rgba(139,92,246,0.13)] left-0 rounded-[20px] size-[47.987px] top-0" data-name="Container">
      <Container34 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="absolute contents inset-[29.15%_8.37%_29.2%_8.33%]" data-name="Icon">
      <div className="absolute inset-[45.81%_8.37%_29.2%_66.64%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-10.654px_-7.325px] mask-size-[15.981px_15.981px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.3268 5.32683">
            <path d={svgPaths.p21ffb720} id="Vector" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.15%_8.37%_29.2%_8.33%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-1.332px_-4.661px] mask-size-[15.981px_15.981px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-[-10%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6488 7.99026">
            <path d={svgPaths.p24067e00} id="Vector_2" stroke="var(--stroke-0, #C10007)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33172" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup2() {
  return (
    <div className="absolute contents inset-[0_0.04%_0.04%_0]" data-name="Clip path group">
      <Icon15 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="h-[15.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup2 />
    </div>
  );
}

function Container36() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[15.988px] top-[3.99px]" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#c10007] text-[16px] top-[-0.2px]">3.2%</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.975px] items-start left-[19.96px] pr-[-0.612px] pt-[1.725px] top-0 w-[38.388px]" data-name="Container">
      <Paragraph9 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-[#ffe2e2] h-[23.975px] left-[284.63px] rounded-[16px] top-0 w-[58.375px]" data-name="Container">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container32() {
  return (
    <div className="absolute h-[47.987px] left-0 top-0 w-[343px]" data-name="Container">
      <Container33 />
      <Container35 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[33.6px] left-0 top-[51.71px] w-[59.237px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[24px] top-[-0.6px]">8,234</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[343px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[16px] top-[-0.4px]">Active Users</p>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute h-[25.563px] left-0 top-[81.58px] w-[343px]" data-name="Container">
      <Paragraph11 />
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute bg-white h-[108px] left-[16px] rounded-[16px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[395.75px] w-[343px]" data-name="Container">
      <Container32 />
      <Paragraph10 />
      <Container38 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[0.19%_0_0.2%_0]" data-name="Group">
      <div className="absolute inset-[99.8%_0_0.2%_0]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[74.9%_0_25.1%_0]" data-name="Vector_2">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector_3">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.09%_0_74.91%_0]" data-name="Vector_4">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0.19%_0_99.81%_0]" data-name="Vector_5">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="h-[260.962px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group />
    </div>
  );
}

function Container40() {
  return (
    <div className="absolute content-stretch flex flex-col h-[260.962px] items-start left-[65px] top-[4.51px] w-[291.988px]" data-name="Container">
      <Icon16 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[0_0.17%]" data-name="Group">
      <div className="absolute inset-[0_99.83%_0_0.17%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_83.22%_0_16.78%]" data-name="Vector_2">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_66.61%_0_33.39%]" data-name="Vector_3">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector_4">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_33.39%_0_66.61%]" data-name="Vector_5">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_16.78%_0_83.22%]" data-name="Vector_6">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_0.17%_0_99.83%]" data-name="Vector_7">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[259.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group1 />
    </div>
  );
}

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col h-[259.988px] items-start left-[64.51px] top-[5px] w-[292.962px]" data-name="Container">
      <Icon17 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[1.3%_0.35%_1.48%_0.34%]" data-name="Group">
      <div className="absolute inset-[1.3%_0.35%_1.48%_0.34%]" data-name="recharts-line-:rs:">
        <div className="absolute inset-[-1.34%_-0.25%_-1.01%_-0.34%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 293.406 113.831">
            <path d={svgPaths.pe436a00} id="recharts-line-:rs:" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99052" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[114.4px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group2 />
    </div>
  );
}

function Container42() {
  return (
    <div className="absolute content-stretch flex flex-col h-[114.4px] items-start left-[64.01px] top-[42.51px] w-[293.7px]" data-name="Container">
      <Icon18 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 1.00617">
            <path d="M0 0.503084H291.976" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00617" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[65px] top-[264.48px] w-[291.988px]" data-name="Container">
      <Icon19 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group3 />
    </div>
  );
}

function Container44() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[64.5px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon20 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group4 />
    </div>
  );
}

function Container45() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[113.15px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon21 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group5 />
    </div>
  );
}

function Container46() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[161.8px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon22 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group6 />
    </div>
  );
}

function Container47() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[210.49px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon23 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group7 />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[259.14px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon24 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group8 />
    </div>
  );
}

function Container49() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[307.79px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon25 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group9 />
    </div>
  );
}

function Container50() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[356.48px] top-[264.98px] w-[1.013px]" data-name="Container">
      <Icon26 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="h-[259.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00617 259.978">
            <path d="M0.503083 0V259.978" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00617" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex flex-col h-[259.988px] items-start left-[64.5px] top-[5px] w-[1.013px]" data-name="Container">
      <Icon27 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group10 />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[264.48px] w-[6.013px]" data-name="Container">
      <Icon28 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group11 />
    </div>
  );
}

function Container53() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[199.5px] w-[6.013px]" data-name="Container">
      <Icon29 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon30() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group12 />
    </div>
  );
}

function Container54() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[134.49px] w-[6.013px]" data-name="Container">
      <Icon30 />
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group13 />
    </div>
  );
}

function Container55() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[69.48px] w-[6.013px]" data-name="Container">
      <Icon31 />
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon32() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group14 />
    </div>
  );
}

function Container56() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[4.5px] w-[6.013px]" data-name="Container">
      <Icon32 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[1.24%_0.5%_1.41%_0.5%]" data-name="Group">
      <div className="absolute inset-[93.63%_97.51%_1.41%_0.5%]" data-name="Vector">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.p2cf21400} fill="var(--fill-0, white)" id="Vector" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70%_81.34%_25.04%_16.67%]" data-name="Vector_2">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.p18020780} fill="var(--fill-0, white)" id="Vector_2" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[80.74%_65.17%_14.3%_32.83%]" data-name="Vector_3">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.9956 8.98487">
            <path d={svgPaths.p16064380} fill="var(--fill-0, white)" id="Vector_3" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[52.81%_49.01%_42.23%_49%]" data-name="Vector_4">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.pa0e8e00} fill="var(--fill-0, white)" id="Vector_4" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[29.17%_32.84%_65.87%_65.17%]" data-name="Vector_5">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.p58fc900} fill="var(--fill-0, white)" id="Vector_5" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[1.24%_16.67%_93.8%_81.34%]" data-name="Vector_6">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.p2a58af00} fill="var(--fill-0, white)" id="Vector_6" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[16.28%_0.5%_78.76%_97.5%]" data-name="Vector_7">
        <div className="absolute inset-[-25.02%_-24.98%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.996 8.98497">
            <path d={svgPaths.pa0e8e00} fill="var(--fill-0, white)" id="Vector_4" stroke="var(--stroke-0, #00A86B)" strokeWidth="2.99675" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon33() {
  return (
    <div className="h-[120.763px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group15 />
    </div>
  );
}

function Container57() {
  return (
    <div className="absolute content-stretch flex flex-col h-[120.763px] items-start left-[60.51px] top-[39.51px] w-[300.962px]" data-name="Container">
      <Icon33 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[52.48px] top-[269.5px] w-[25.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Mon</p>
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[103.16px] top-[269.5px] w-[21px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Tue</p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[149.31px] top-[269.5px] w-[26px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Wed</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[199.99px] top-[269.5px] w-[22.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Thu</p>
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[252.15px] top-[269.5px] w-[15px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Fri</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[298.8px] top-[269.5px] w-[19.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Sat</p>
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[337.25px] top-[269.5px] w-[21.975px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Sun</p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[49px] top-[257.24px] w-[8.012px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">0</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[27px] top-[192.25px] w-[30.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">2500</p>
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[27px] top-[127.25px] w-[30.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">5000</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[27px] top-[62.24px] w-[30.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">7500</p>
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[20.99px] top-[4.25px] w-[36.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">10000</p>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute h-[299.988px] left-[-8px] overflow-clip top-[562.99px] w-[361.975px]" data-name="Container">
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
      <Container44 />
      <Container45 />
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
      <Container52 />
      <Container53 />
      <Container54 />
      <Container55 />
      <Container56 />
      <Container57 />
      <Paragraph12 />
      <Paragraph13 />
      <Paragraph14 />
      <Paragraph15 />
      <Paragraph16 />
      <Paragraph17 />
      <Paragraph18 />
      <Paragraph19 />
      <Paragraph20 />
      <Paragraph21 />
      <Paragraph22 />
      <Paragraph23 />
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="absolute h-[33.6px] left-[13px] top-[521px] w-[214px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[24px] top-[-0.6px]">Revenue Overview</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="absolute h-[33.6px] left-0 top-[3.73px] w-[178.338px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[24px] top-[-0.6px]">Orders This Week</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[0.19%_0_0.2%_0]" data-name="Group">
      <div className="absolute inset-[99.8%_0_0.2%_0]" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[74.9%_0_25.1%_0]" data-name="Vector_2">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector_3">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.09%_0_74.91%_0]" data-name="Vector_4">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0.19%_0_99.81%_0]" data-name="Vector_5">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 0.999867">
            <path d="M0 0.499933H291.976" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999867" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon34() {
  return (
    <div className="h-[260.962px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group16 />
    </div>
  );
}

function Container60() {
  return (
    <div className="absolute content-stretch flex flex-col h-[260.962px] items-start left-[65px] top-[4.51px] w-[291.988px]" data-name="Container">
      <Icon34 />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[0_0.17%]" data-name="Group">
      <div className="absolute inset-[0_92.71%_0_7.29%]" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_78.47%_0_21.53%]" data-name="Vector_2">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_64.24%_0_35.76%]" data-name="Vector_3">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector_4">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_35.77%_0_64.23%]" data-name="Vector_5">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_21.53%_0_78.47%]" data-name="Vector_6">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_7.29%_0_92.71%]" data-name="Vector_7">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_99.83%_0_0.17%]" data-name="Vector_8">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[0_0.17%_0_99.83%]" data-name="Vector_9">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.999872 259.978">
            <path d="M0.499936 0V259.978" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" strokeWidth="0.999872" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon35() {
  return (
    <div className="h-[259.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group17 />
    </div>
  );
}

function Container61() {
  return (
    <div className="absolute content-stretch flex flex-col h-[259.988px] items-start left-[64.51px] top-[5px] w-[292.962px]" data-name="Container">
      <Icon35 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[0_0_0.27%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.27%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.9862 125.338">
          <path d={svgPaths.p2064d280} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon36() {
  return (
    <div className="h-[125.675px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group18 />
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex flex-col h-[125.675px] items-start left-[69.16px] top-[139.31px] w-[32.987px]" data-name="Container">
      <Icon36 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[0_0_0.48%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.48%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.0237 153.526">
          <path d={svgPaths.p28d13c00} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon37() {
  return (
    <div className="h-[154.262px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group19 />
    </div>
  );
}

function Container63() {
  return (
    <div className="absolute content-stretch flex flex-col h-[154.262px] items-start left-[110.86px] top-[110.73px] w-[33.025px]" data-name="Container">
      <Icon37 />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.0237 142.982">
        <path d={svgPaths.p18cba080} fill="var(--fill-0, #00A86B)" id="Vector" />
      </svg>
    </div>
  );
}

function Icon38() {
  return (
    <div className="h-[142.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group20 />
    </div>
  );
}

function Container64() {
  return (
    <div className="absolute content-stretch flex flex-col h-[142.988px] items-start left-[152.56px] top-[122px] w-[33.025px]" data-name="Container">
      <Icon38 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[0_0_0.24%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.24%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.9862 171.206">
          <path d={svgPaths.pdb5e600} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon39() {
  return (
    <div className="h-[171.613px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group21 />
    </div>
  );
}

function Container65() {
  return (
    <div className="absolute content-stretch flex flex-col h-[171.613px] items-start left-[194.3px] top-[93.38px] w-[32.987px]" data-name="Container">
      <Icon39 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-[0_0_0.1%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.1%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.0237 202.605">
          <path d={svgPaths.p22b13c00} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon40() {
  return (
    <div className="h-[202.813px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group22 />
    </div>
  );
}

function Container66() {
  return (
    <div className="absolute content-stretch flex flex-col h-[202.813px] items-start left-[236px] top-[62.17px] w-[33.025px]" data-name="Container">
      <Icon40 />
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents inset-[0_0_0.22%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.22%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.0237 249.933">
          <path d={svgPaths.p19510000} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon41() {
  return (
    <div className="h-[250.475px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group23 />
    </div>
  );
}

function Container67() {
  return (
    <div className="absolute content-stretch flex flex-col h-[250.475px] items-start left-[277.7px] top-[14.51px] w-[33.025px]" data-name="Container">
      <Icon41 />
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents inset-[0_0_0.06%_0]" data-name="Group">
      <div className="absolute inset-[0_0_0.06%_0]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.9862 221.708">
          <path d={svgPaths.p3dc33800} fill="var(--fill-0, #00A86B)" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function Icon42() {
  return (
    <div className="h-[221.85px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group24 />
    </div>
  );
}

function Container68() {
  return (
    <div className="absolute content-stretch flex flex-col h-[221.85px] items-start left-[319.44px] top-[43.14px] w-[32.987px]" data-name="Container">
      <Icon42 />
    </div>
  );
}

function Icon43() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 291.976 1.00617">
            <path d="M0 0.503084H291.976" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00617" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[65px] top-[264.47px] w-[291.988px]" data-name="Container">
      <Icon43 />
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon44() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group25 />
    </div>
  );
}

function Container70() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[85.35px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon44 />
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon45() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group26 />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[127.05px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon45 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon46() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group27 />
    </div>
  );
}

function Container72() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[168.75px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon46 />
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon47() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group28 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[210.49px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon47 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon48() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group29 />
    </div>
  );
}

function Container74() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[252.19px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon48 />
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon49() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group30 />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[293.89px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon49 />
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute bottom-0 contents left-1/2 right-1/2 top-0" data-name="Group">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00724 6.0125">
            <path d="M0.503619 6.0125V0" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon50() {
  return (
    <div className="h-[6.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group31 />
    </div>
  );
}

function Container76() {
  return (
    <div className="absolute content-stretch flex flex-col h-[6.013px] items-start left-[335.63px] top-[264.97px] w-[1.013px]" data-name="Container">
      <Icon50 />
    </div>
  );
}

function Icon51() {
  return (
    <div className="h-[259.988px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-0 left-1/2 right-1/2 top-0" data-name="Vector">
        <div className="absolute inset-[0_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.00617 259.978">
            <path d="M0.503083 0V259.978" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00617" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex flex-col h-[259.988px] items-start left-[64.5px] top-[5px] w-[1.013px]" data-name="Container">
      <Icon51 />
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon52() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group32 />
    </div>
  );
}

function Container78() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[264.47px] w-[6.013px]" data-name="Container">
      <Icon52 />
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon53() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group33 />
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[199.5px] w-[6.013px]" data-name="Container">
      <Icon53 />
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon54() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group34 />
    </div>
  );
}

function Container80() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[134.49px] w-[6.013px]" data-name="Container">
      <Icon54 />
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon55() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group35 />
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[69.48px] w-[6.013px]" data-name="Container">
      <Icon55 />
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute bottom-1/2 contents left-0 right-0 top-1/2" data-name="Group">
      <div className="absolute bottom-1/2 left-0 right-0 top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.0125 1.00724">
            <path d="M0 0.503619H6.0125" id="Vector" stroke="var(--stroke-0, #6B7280)" strokeWidth="1.00724" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon56() {
  return (
    <div className="h-[1.013px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Group36 />
    </div>
  );
}

function Container82() {
  return (
    <div className="absolute content-stretch flex flex-col h-[1.013px] items-start left-[59px] top-[4.5px] w-[6.013px]" data-name="Container">
      <Icon56 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[73.33px] top-[269.5px] w-[25.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Mon</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[117.06px] top-[269.5px] w-[21px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Tue</p>
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[156.26px] top-[269.5px] w-[26.038px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Wed</p>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[199.99px] top-[269.5px] w-[22.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Thu</p>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[245.2px] top-[269.5px] w-[15px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Fri</p>
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[284.9px] top-[269.5px] w-[19.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Sat</p>
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[325.13px] top-[269.5px] w-[22.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center">Sun</p>
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[49px] top-[257.24px] w-[8.012px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">0</p>
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[41.99px] top-[192.25px] w-[15.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">75</p>
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[35.97px] top-[127.25px] w-[21.038px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">150</p>
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[35px] top-[62.24px] w-[22.013px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">225</p>
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="absolute content-stretch flex h-[15.012px] items-start left-[33.99px] top-[4.25px] w-[23.025px]" data-name="Paragraph">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-right">300</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="absolute h-[299.988px] left-[-24px] overflow-clip top-[43px] w-[361.975px]" data-name="Container">
      <Container60 />
      <Container61 />
      <Container62 />
      <Container63 />
      <Container64 />
      <Container65 />
      <Container66 />
      <Container67 />
      <Container68 />
      <Container69 />
      <Container70 />
      <Container71 />
      <Container72 />
      <Container73 />
      <Container74 />
      <Container75 />
      <Container76 />
      <Container77 />
      <Container78 />
      <Container79 />
      <Container80 />
      <Container81 />
      <Container82 />
      <Paragraph26 />
      <Paragraph27 />
      <Paragraph28 />
      <Paragraph29 />
      <Paragraph30 />
      <Paragraph31 />
      <Paragraph32 />
      <Paragraph33 />
      <Paragraph34 />
      <Paragraph35 />
      <Paragraph36 />
      <Paragraph37 />
    </div>
  );
}

function Container58() {
  return (
    <div className="absolute bg-white h-[334px] left-[19px] rounded-[16px] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1)] top-[863px] w-[338px]" data-name="Container">
      <Paragraph25 />
      <Container59 />
    </div>
  );
}

function Paragraph38() {
  return (
    <div className="h-[33.6px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:SemiBold',sans-serif] font-semibold leading-[33.6px] left-0 not-italic text-[#111827] text-[24px] top-[-0.6px]">Active Orders</p>
    </div>
  );
}

function Container84() {
  return (
    <div className="absolute content-stretch flex flex-col h-[33.588px] items-start left-0 pr-[14.625px] pt-[3.725px] top-[0.2px] w-[151.025px]" data-name="Container">
      <Paragraph38 />
    </div>
  );
}

function Paragraph39() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-[27px] not-italic text-[#00a86b] text-[16px] text-center top-[-0.2px]">View All</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.975px] items-start left-[283.6px] pl-[2.2px] pr-[1.6px] pt-[1.725px] top-[5.01px] w-[57.4px]" data-name="Container">
      <Paragraph39 />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute h-[34px] left-[16px] top-[1206px] w-[341px]" data-name="Container">
      <Container84 />
      <Container85 />
    </div>
  );
}

function Icon58() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99997 5.99997">
            <path d={svgPaths.p92ebb00} id="Vector" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector_2">
        <div className="absolute inset-[-1px_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.794 1.99997">
            <path d="M0.999985 0.999985H18.794" id="Vector_2" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector_3">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
            <path d={svgPaths.p1e55f280} id="Vector_3" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon57() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon58 />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[7.86px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon57 />
    </div>
  );
}

function Container88() {
  return (
    <div className="absolute bg-[rgba(0,168,107,0.1)] h-[47.987px] left-0 rounded-[20px] top-[27.15px] w-[39.75px]" data-name="Container">
      <Container89 />
    </div>
  );
}

function Paragraph40() {
  return (
    <div className="absolute h-[25.6px] left-[0.5px] top-[27.3px] w-[73px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#111827] text-[14px] top-[-0.8px]">#ORD-2451</p>
    </div>
  );
}

function Paragraph41() {
  return (
    <div className="absolute h-[25.6px] left-[0.25px] top-[51.15px] w-[68px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[14px] top-[-0.8px]">Ahmed Ali</p>
    </div>
  );
}

function Container90() {
  return (
    <div className="absolute h-[102.287px] left-[55.74px] top-0 w-[73.463px]" data-name="Container">
      <Paragraph40 />
      <Paragraph41 />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute h-[102.287px] left-0 top-[-12.64px] w-[129.213px]" data-name="Container">
      <Container88 />
      <Container90 />
    </div>
  );
}

function Container93() {
  return <div className="absolute bg-[#2b7fff] left-0 rounded-[9999px] size-[5.988px] top-[8.99px]" data-name="Container" />;
}

function Paragraph42() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#1447e6] text-[14px] top-[-0.6px]">Preparing</p>
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute content-stretch flex flex-col h-[23.975px] items-start left-[11.98px] pl-[3.787px] pr-[8.375px] pt-[-1.713px] top-0 w-[69.363px]" data-name="Container">
      <Paragraph42 />
    </div>
  );
}

function Container92() {
  return (
    <div className="absolute bg-[#dbeafe] h-[23.975px] left-0 rounded-[9999px] top-[4.51px] w-[81.338px]" data-name="Container">
      <Container93 />
      <Container94 />
    </div>
  );
}

function Icon60() {
  return (
    <div className="absolute contents inset-[8.26%_9.12%_9.12%_8.26%]" data-name="Icon">
      <div className="absolute inset-[24.79%_33.91%_42.17%_49.57%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.418px_-2.209px] mask-size-[8.836px_8.836px]" data-name="Vector" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-12.5%_-25.01%_-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.20906 3.68171">
            <path d={svgPaths.p1f11000} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.26%_9.12%_9.12%_8.26%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.736px_-0.736px] mask-size-[8.836px_8.836px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.09959 8.09959">
            <path d={svgPaths.p20da2800} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup3() {
  return (
    <div className="absolute contents inset-[0_0.86%_0.86%_0]" data-name="Clip path group">
      <Icon60 />
    </div>
  );
}

function Icon59() {
  return (
    <div className="h-[8.913px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup3 />
    </div>
  );
}

function Container96() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[8.913px] top-[31.51px]" data-name="Container">
      <Icon59 />
    </div>
  );
}

function Paragraph43() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#6b7280] text-[12px]">15 min ago</p>
    </div>
  );
}

function Container97() {
  return (
    <div className="absolute content-stretch flex flex-col h-[71.938px] items-start left-[12.89px] pl-[-0.45px] pr-[-14.138px] pt-[24.25px] top-0 w-[44.413px]" data-name="Container">
      <Paragraph43 />
    </div>
  );
}

function Container95() {
  return (
    <div className="absolute h-[71.938px] left-[90.34px] top-[-19.46px] w-[57.313px]" data-name="Container">
      <Container96 />
      <Container97 />
    </div>
  );
}

function Paragraph44() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[50px]" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-[50.7px] not-italic text-[#111827] text-[16px] text-right top-[-0.4px]">$24.50</p>
    </div>
  );
}

function Container98() {
  return (
    <div className="absolute h-[25px] left-[156.65px] top-[4px] w-[50px]" data-name="Container">
      <Paragraph44 />
    </div>
  );
}

function Container91() {
  return (
    <div className="absolute h-[33px] left-[135px] top-[22px] w-[207px]" data-name="Container">
      <Container92 />
      <Container95 />
      <Container98 />
    </div>
  );
}

function Container86() {
  return (
    <div className="absolute bg-[#f9fafb] h-[77px] left-[17px] rounded-[20px] top-[1272px] w-[342px]" data-name="Container">
      <Container87 />
      <Container91 />
    </div>
  );
}

function Icon62() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99997 5.99997">
            <path d={svgPaths.p92ebb00} id="Vector" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector_2">
        <div className="absolute inset-[-1px_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.794 1.99997">
            <path d="M0.999985 0.999985H18.794" id="Vector_2" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector_3">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
            <path d={svgPaths.p1e55f280} id="Vector_3" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon61() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon62 />
    </div>
  );
}

function Container102() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[7.86px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon61 />
    </div>
  );
}

function Container101() {
  return (
    <div className="absolute bg-[rgba(0,168,107,0.1)] h-[47.987px] left-0 rounded-[20px] top-[27.15px] w-[39.75px]" data-name="Container">
      <Container102 />
    </div>
  );
}

function Paragraph45() {
  return (
    <div className="absolute h-[25.6px] left-[0.5px] top-[27.3px] w-[73px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#111827] text-[14px] top-[-0.8px]">#ORD-2451</p>
    </div>
  );
}

function Paragraph46() {
  return (
    <div className="absolute h-[25.6px] left-[0.25px] top-[51.15px] w-[68px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[14px] top-[-0.8px]">Ahmed Ali</p>
    </div>
  );
}

function Container103() {
  return (
    <div className="absolute h-[102.287px] left-[55.74px] top-0 w-[73.463px]" data-name="Container">
      <Paragraph45 />
      <Paragraph46 />
    </div>
  );
}

function Container100() {
  return (
    <div className="absolute h-[102.287px] left-0 top-[-12.64px] w-[129.213px]" data-name="Container">
      <Container101 />
      <Container103 />
    </div>
  );
}

function Container106() {
  return <div className="absolute bg-[#d12bff] left-0 rounded-[9999px] size-[5.988px] top-[19.5px]" data-name="Container" />;
}

function Paragraph47() {
  return (
    <div className="h-[47px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[24px] left-0 not-italic text-[#8014e6] text-[12px] top-[-1px] w-[41px] whitespace-pre-wrap">Out for Delivery</p>
    </div>
  );
}

function Container107() {
  return (
    <div className="absolute content-stretch flex flex-col h-[45px] items-start left-[11.98px] pl-[4px] pr-[18.025px] pt-[-2px] top-0 w-[66.025px]" data-name="Container">
      <Paragraph47 />
    </div>
  );
}

function Container105() {
  return (
    <div className="absolute bg-[#eddbfe] h-[45px] left-0 rounded-[9999px] top-[-6px] w-[78px]" data-name="Container">
      <Container106 />
      <Container107 />
    </div>
  );
}

function Icon64() {
  return (
    <div className="absolute contents inset-[8.26%_9.12%_9.12%_8.26%]" data-name="Icon">
      <div className="absolute inset-[24.79%_33.91%_42.17%_49.57%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.418px_-2.209px] mask-size-[8.836px_8.836px]" data-name="Vector" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-12.5%_-25.01%_-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.20906 3.68171">
            <path d={svgPaths.p1f11000} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.26%_9.12%_9.12%_8.26%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.736px_-0.736px] mask-size-[8.836px_8.836px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.09959 8.09959">
            <path d={svgPaths.p20da2800} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup4() {
  return (
    <div className="absolute contents inset-[0_0.86%_0.86%_0]" data-name="Clip path group">
      <Icon64 />
    </div>
  );
}

function Icon63() {
  return (
    <div className="h-[8.913px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup4 />
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[8.913px] top-[31.51px]" data-name="Container">
      <Icon63 />
    </div>
  );
}

function Paragraph48() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#6b7280] text-[12px]">15 min ago</p>
    </div>
  );
}

function Container110() {
  return (
    <div className="absolute content-stretch flex flex-col h-[71.938px] items-start left-[12.89px] pl-[-0.45px] pr-[-14.137px] pt-[24.25px] top-0 w-[44.413px]" data-name="Container">
      <Paragraph48 />
    </div>
  );
}

function Container108() {
  return (
    <div className="absolute h-[71.938px] left-[88px] top-[-19.46px] w-[57.313px]" data-name="Container">
      <Container109 />
      <Container110 />
    </div>
  );
}

function Paragraph49() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[50px]" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-[50.7px] not-italic text-[#111827] text-[16px] text-right top-[-0.4px]">$24.50</p>
    </div>
  );
}

function Container111() {
  return (
    <div className="absolute h-[25px] left-[155.31px] top-[4px] w-[50px]" data-name="Container">
      <Paragraph49 />
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute h-[33px] left-[141px] top-[22px] w-[207px]" data-name="Container">
      <Container105 />
      <Container108 />
      <Container111 />
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute bg-[#f9fafb] h-[77px] left-[17px] rounded-[20px] top-[1362px] w-[348px]" data-name="Container">
      <Container100 />
      <Container104 />
    </div>
  );
}

function Icon66() {
  return (
    <div className="absolute contents inset-[8.33%_12.5%]" data-name="Icon">
      <div className="absolute inset-[41.67%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.99997 5.99997">
            <path d={svgPaths.p92ebb00} id="Vector" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[25.14%_12.93%_74.86%_12.93%]" data-name="Vector_2">
        <div className="absolute inset-[-1px_-5.62%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.794 1.99997">
            <path d="M0.999985 0.999985H18.794" id="Vector_2" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_12.5%]" data-name="Vector_3">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 22">
            <path d={svgPaths.p1e55f280} id="Vector_3" stroke="var(--stroke-0, #00A86B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99997" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon65() {
  return (
    <div className="h-[24px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <Icon66 />
    </div>
  );
}

function Container115() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[7.86px] size-[24px] top-[11.99px]" data-name="Container">
      <Icon65 />
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute bg-[rgba(0,168,107,0.1)] h-[47.987px] left-0 rounded-[20px] top-[27.15px] w-[39.75px]" data-name="Container">
      <Container115 />
    </div>
  );
}

function Paragraph50() {
  return (
    <div className="absolute h-[25.6px] left-[0.5px] top-[27.3px] w-[73px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#111827] text-[14px] top-[-0.8px]">#ORD-2451</p>
    </div>
  );
}

function Paragraph51() {
  return (
    <div className="absolute h-[25.6px] left-[0.25px] top-[51.15px] w-[68px]" data-name="Paragraph">
      <p className="absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-0 not-italic text-[#4b5563] text-[14px] top-[-0.8px]">Ahmed Ali</p>
    </div>
  );
}

function Container116() {
  return (
    <div className="absolute h-[102.287px] left-[55.74px] top-0 w-[73.463px]" data-name="Container">
      <Paragraph50 />
      <Paragraph51 />
    </div>
  );
}

function Container113() {
  return (
    <div className="absolute h-[102.287px] left-0 top-[-12.64px] w-[129.213px]" data-name="Container">
      <Container114 />
      <Container116 />
    </div>
  );
}

function Container119() {
  return <div className="absolute bg-[#fffb2b] left-0 rounded-[9999px] size-[5.988px] top-[11.5px]" data-name="Container" />;
}

function Paragraph52() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#e6cd14] text-[12px]">Pending</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute content-stretch flex flex-col h-[33px] items-start left-[11.98px] pl-[4px] pr-[18.025px] pt-[5px] top-[-2px] w-[66.025px]" data-name="Container">
      <Paragraph52 />
    </div>
  );
}

function Container118() {
  return (
    <div className="absolute bg-[#fef8db] h-[29px] left-0 rounded-[9999px] top-[2px] w-[78px]" data-name="Container">
      <Container119 />
      <Container120 />
    </div>
  );
}

function Icon68() {
  return (
    <div className="absolute contents inset-[8.26%_9.12%_9.12%_8.26%]" data-name="Icon">
      <div className="absolute inset-[24.79%_33.91%_42.17%_49.57%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4.418px_-2.209px] mask-size-[8.836px_8.836px]" data-name="Vector" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-12.5%_-25.01%_-12.5%_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.20906 3.68171">
            <path d={svgPaths.p1f11000} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.26%_9.12%_9.12%_8.26%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.736px_-0.736px] mask-size-[8.836px_8.836px]" data-name="Vector_2" style={{ maskImage: `url('${imgVector1}')` }}>
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.09959 8.09959">
            <path d={svgPaths.p20da2800} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.736327" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClipPathGroup5() {
  return (
    <div className="absolute contents inset-[0_0.86%_0.86%_0]" data-name="Clip path group">
      <Icon68 />
    </div>
  );
}

function Icon67() {
  return (
    <div className="h-[8.913px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <ClipPathGroup5 />
    </div>
  );
}

function Container122() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[8.913px] top-[31.51px]" data-name="Container">
      <Icon67 />
    </div>
  );
}

function Paragraph53() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="font-['Cairo:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#6b7280] text-[12px]">15 min ago</p>
    </div>
  );
}

function Container123() {
  return (
    <div className="absolute content-stretch flex flex-col h-[71.938px] items-start left-[12.89px] pl-[-0.45px] pr-[-14.137px] pt-[24.25px] top-0 w-[44.413px]" data-name="Container">
      <Paragraph53 />
    </div>
  );
}

function Container121() {
  return (
    <div className="absolute h-[71.938px] left-[88px] top-[-19.46px] w-[57.313px]" data-name="Container">
      <Container122 />
      <Container123 />
    </div>
  );
}

function Paragraph54() {
  return (
    <div className="absolute h-[25.6px] left-0 top-0 w-[50px]" data-name="Paragraph">
      <p className="-translate-x-full absolute font-['Cairo:Regular',sans-serif] font-normal leading-[25.6px] left-[50.7px] not-italic text-[#111827] text-[16px] text-right top-[-0.4px]">$24.50</p>
    </div>
  );
}

function Container124() {
  return (
    <div className="absolute h-[25px] left-[155.31px] top-[4px] w-[50px]" data-name="Container">
      <Paragraph54 />
    </div>
  );
}

function Container117() {
  return (
    <div className="absolute h-[33px] left-[141px] top-[22px] w-[207px]" data-name="Container">
      <Container118 />
      <Container121 />
      <Container124 />
    </div>
  );
}

function Container112() {
  return (
    <div className="absolute bg-[#f9fafb] h-[77px] left-[17px] rounded-[20px] top-[1452px] w-[348px]" data-name="Container">
      <Container113 />
      <Container117 />
    </div>
  );
}

function PQ() {
  return (
    <div className="absolute bg-white h-[681.6px] left-0 top-0 w-[1072px]" data-name="pQ">
      <Container />
      <Container6 />
      <Container10 />
      <Container15 />
      <Container23 />
      <Container31 />
      <Container39 />
      <Paragraph24 />
      <Container58 />
      <Container83 />
      <Container86 />
      <Container99 />
      <Container112 />
    </div>
  );
}

function ChatgptSidebar() {
  return <div className="absolute h-0 left-0 top-[681.6px] w-[1072px]" data-name="Chatgpt-sidebar" />;
}

function Button() {
  return (
    <div className="bg-[#e95322] h-[45px] relative rounded-[40px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-[179.588px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[90px] not-italic text-[14px] text-center text-white top-[11.6px]">Manage Restaurants</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[48.2px] relative rounded-[40px] shrink-0 w-[179.588px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#e95322] border-[1.6px] border-solid inset-0 pointer-events-none rounded-[40px] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[21px] left-[90.13px] not-italic text-[#e95322] text-[14px] text-center top-[13.2px]">Manage Users</p>
      </div>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[105.2px] items-start left-[868.41px] top-[456.4px] w-[179.588px]" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

export default function FoodOrderingWebsite() {
  return (
    <div className="bg-white relative size-full" data-name="Food Ordering Website">
      <PQ />
      <ChatgptSidebar />
      <Container125 />
    </div>
  );
}