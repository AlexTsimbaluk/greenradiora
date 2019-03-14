export default function decodeCode (code) {
	let variants = [];

	switch(code) {
		/* Пунктуация, пробел, частые символы, цифры */

		case 32: // пробел
			variants.push(8258);
			variants.push(8277);
			variants.push(9752);
			variants.push(9784);
			variants.push(9880);
			variants.push(9884);
			variants.push(9909);
			variants.push(10018);
			variants.push(10019);
			variants.push(10020);
			variants.push(10021);
			variants.push(10022);
			variants.push(10023);
			// variants.push(10024);
			variants.push(10025);
			variants.push(10026);
			variants.push(10027);
			variants.push(10028);
			variants.push(10029);
			variants.push(10030);
			variants.push(10031);
			variants.push(10032);
			variants.push(10033);
			variants.push(10034);
			variants.push(10035);
			variants.push(10036);
			variants.push(10037);
			variants.push(10038);
			variants.push(10039);
			variants.push(10040);
			variants.push(10041);
			variants.push(10042);
			variants.push(10043);
			variants.push(10044);
			variants.push(10045);
			variants.push(10046);
			variants.push(10047);
			variants.push(10048);
			variants.push(10049);
			variants.push(10050);
			variants.push(10051);
			variants.push(10052);
			variants.push(10053);
			variants.push(10054);
			variants.push(10055);
			variants.push(10056);
			variants.push(10057);
			variants.push(10058);
			variants.push(10059);
			
			/*variants.push(42340);
			variants.push(42341);
			variants.push(6821);
			variants.push(127808);
			variants.push(127799);
			variants.push(127800);
			variants.push(127801);
			variants.push(127802);
			variants.push(127803);
			variants.push(127804);
			variants.push(128144);*/

			// variants.push();
			break;

		case 33: // !

			break;
		
		case 34: // "

			break;

		case 35: // #

			break;

		case 36: // $

			break;

		case 37: // %

			break;

		case 38: // &

			break;

		case 39: // '

			break;

		case 40: // (

			break;

		case 41: // )

			break;

		case 42: // *

			break;

		case 43: // +

			break;

		case 44: // ,

			break;

		case 45: // -

			break;

		case 46: // .

			break;


		case 47: // /

			break;

		case 48: // 0

			break;

		case 49: // 1

			break;

		case 50: // 2

			break;

		case 51: // 3

			break;

		case 52: // 4

			break;

		case 53: // 5

			break;

		case 54: // 6

			break;

		case 55: // 7

			break;

		case 56: // 8

			break;

		case 57: // 9

			break;

		case 58: // :

			break;

		case 59: // ;

			break;

		case 60: // <

			break;

		case 61: // =

			break;

		
		case 62: // >

			break;

		case 63: // ?

			break;

		case 64: // @

			break;


		/* A - Z */

		case 65: // A
			variants.push(570);
			variants.push(582);
			variants.push(916);
			variants.push(1126);
			variants.push(5122);
			variants.push(7680);
			variants.push(7840);
			variants.push(7842);
			variants.push(7844);
			variants.push(7846);
			variants.push(7848);
			variants.push(7850);
			variants.push(7852);
			variants.push(7854);
			variants.push(7856);
			variants.push(7858);
			variants.push(7860);
			variants.push(7862);
			variants.push(8491);
			variants.push(11375);
			variants.push(42582);
			variants.push(42584);
			variants.push(66662);
			break;

		case 66: // B
			variants.push(579);
			variants.push(7682);
			variants.push(7684);
			variants.push(7838);
			variants.push(7686);
			variants.push(8492);
			variants.push(65922);
			break;

		case 67: // C
			variants.push(1021);
			variants.push(1022);
			variants.push(7688);
			variants.push(42814);
			break;

		case 68: // D
			variants.push(270);
			variants.push(272);
			variants.push(7690);
			variants.push(7692);
			variants.push(7694);
			variants.push(7696);
			variants.push(7698);
			
			break;

		case 69: // E
			variants.push(582);
			variants.push(1214);
			variants.push(7700);
			variants.push(7702);
			variants.push(7704);
			variants.push(7706);
			variants.push(7708);
			variants.push(7864);
			variants.push(7866);
			variants.push(7868);
			variants.push(7870);
			variants.push(7872);
			variants.push(7874);
			variants.push(7876);
			variants.push(7878);
			variants.push(8493);
			break;

		case 70: // F
			variants.push(7710);
			variants.push(8457);
			variants.push(8497);
			break;

		case 71: // G
			variants.push(284);
			variants.push(290);
			variants.push(7712);
			variants.push(42912);
			break;

		case 72: // H
			variants.push(292);
			variants.push(294);
			variants.push(7714);
			variants.push(7716);
			variants.push(7718);
			variants.push(7720);
			variants.push(7722);
			variants.push(1186);
			variants.push(1188);
			variants.push(42922);
			break;

		case 73: // I
			variants.push(302);
			variants.push(1031);
			variants.push(7724);
			variants.push(7726);
			variants.push(7880);
			variants.push(7882);
			break;

		case 74: // J
			variants.push(308);
			break;

		case 75: // K
			variants.push(1180);
			variants.push(1182);
			variants.push(1184);
			variants.push(1310);
			variants.push(7728);
			variants.push(7730);
			variants.push(7732);
			variants.push(42816);
			variants.push(42914);
			variants.push(65944);
			break;

		case 76: // L
			variants.push(317);
			variants.push(319);
			variants.push(321);
			variants.push(573);
			variants.push(7734);
			variants.push(7736);
			variants.push(7738);
			variants.push(7740);
			variants.push(7930);
			variants.push(42824);
			break;

		case 77: // M
			variants.push(7742);
			variants.push(7744);
			variants.push(7746);
			variants.push(11374);
			variants.push(43005);
			break;

		case 78: // N
			variants.push(327);
			variants.push(330);
			variants.push(7748);
			variants.push(7750);
			variants.push(7752);
			variants.push(7754);
			variants.push(42916);
			break;

		case 79: // O
			variants.push(336);
			variants.push(556);
			variants.push(1256);
			variants.push(1258);
			variants.push(7756);
			variants.push(7758);
			variants.push(7760);
			variants.push(7762);
			variants.push(7884);
			variants.push(7886);
			variants.push(7888);
			variants.push(7890);
			variants.push(7892);
			variants.push(7894);
			variants.push(7896);
			variants.push(7898);
			variants.push(7900);
			variants.push(7902);
			variants.push(7904);
			variants.push(7906);
			
			break;

		case 80: // P
			variants.push(1166);
			variants.push(5502);
			variants.push(5504);
			variants.push(7764);
			variants.push(7766);
			variants.push(8253);
			variants.push(8267);
			variants.push(42832);
			variants.push(42834);
			break;

		case 81: // Q
			variants.push(8474);
			break;

		case 82: // R
			variants.push(588);
			variants.push(7768);
			variants.push(7770);
			variants.push(7772);
			variants.push(7774);
			variants.push(8476);
			variants.push(8477);
			variants.push(8479);
			variants.push(42918);
			variants.push(65958);
			break;

		case 83: // S
			variants.push(7776);
			variants.push(7778);
			variants.push(7780);
			variants.push(7782);
			variants.push(7784);
			variants.push(11390);
			variants.push(42920);
			break;

		case 84: // T
			variants.push(1196);
			variants.push(7786);
			variants.push(7788);
			variants.push(7790);
			variants.push(7792);
			variants.push(42825);
			variants.push(65964);
			variants.push(65966);
			break;

		case 85: // U
			variants.push(7794);
			variants.push(7796);
			variants.push(7798);
			variants.push(7800);
			variants.push(7802);
			variants.push(7908);
			variants.push(7910);
			variants.push(7912);
			variants.push(7914);
			variants.push(7916);
			variants.push(7918);
			variants.push(7920);
			variants.push(65967);
			break;

		case 86: // V
			variants.push(7804);
			variants.push(7806);
			variants.push(11377);
			break;

		case 87: // W
			variants.push(7808);
			variants.push(7810);
			variants.push(7812);
			variants.push(7814);
			variants.push(7816);
			variants.push(65510);
			break;

		case 88: // X
			variants.push(1276);
			variants.push(1278);
			variants.push(4287);
			variants.push(7818);
			variants.push(7820);
			break;

		case 89: // Y
			variants.push(590);
			variants.push(7822);
			variants.push(7922);
			variants.push(7924);
			variants.push(7926);
			variants.push(7928);
			variants.push(65971);
			variants.push(65912);
			break;

		case 90: // Z
			variants.push(7824);
			variants.push(7826);
			variants.push(7828);
			variants.push(11391);
			variants.push(65973);
			break;

		/* a - z */
		case 97: // a
			variants.push(170);
			variants.push(7681);
			variants.push(7834);
			variants.push(7841);
			variants.push(7843);
			variants.push(7845);
			variants.push(7847);
			variants.push(7849);
			variants.push(7851);
			variants.push(7853);
			variants.push(7855);
			variants.push(7857);
			variants.push(7859);
			variants.push(7861);
			variants.push(7863);
			variants.push(8119);
			variants.push(8071);
			variants.push(9074);
			variants.push(9078);
			variants.push(9082);
			variants.push(42583);
			variants.push(65998);
			break;

		case 98: // b
			variants.push(384);
			variants.push(389);
			variants.push(7683);
			variants.push(7685);
			variants.push(7687);
			variants.push(7839);
			variants.push(65920);
			break;

		case 99: // c
			variants.push(162);
			variants.push(263);
			variants.push(265);
			variants.push(267);
			variants.push(267);
			variants.push(269);				
			variants.push(1195);
			variants.push(7689);
			break;

		case 100: // d
			variants.push(271);
			variants.push(273);
			variants.push(545);
			variants.push(7691);
			variants.push(7693);
			variants.push(7695);
			variants.push(7697);
			variants.push(7699);
			break;

		case 101: // e
			variants.push(583);
			variants.push(7701);
			variants.push(7703);
			variants.push(7705);
			variants.push(7707);
			variants.push(7709);
			variants.push(7865);
			variants.push(7867);
			variants.push(7869);
			variants.push(7871);
			variants.push(7873);
			variants.push(7875);
			variants.push(7877);
			variants.push(7879);
			variants.push(8493);
			break;

		case 102: // f
			variants.push(402);
			variants.push(589);
			variants.push(981);
			variants.push(7711);
			variants.push(7835);
			variants.push(7836);
			variants.push(7837);
			variants.push(42919);
			break;

		case 103: // g
			variants.push(285);
			variants.push(287);
			variants.push(289);
			variants.push(291);
			variants.push(485);
			variants.push(487);
			variants.push(7713);
			variants.push(42913);
			break;

		case 104: // h
			variants.push(293);
			variants.push(295);
			variants.push(7715);
			variants.push(7717);
			variants.push(7719);
			variants.push(7721);
			variants.push(7723);
			variants.push(7830);
			break;

		case 105: // i
			variants.push(297);
			variants.push(299);
			variants.push(301);
			variants.push(303);
			variants.push(1031);
			variants.push(7725);
			variants.push(7727);
			variants.push(7881);
			variants.push(7883);
			break;

		case 106: // j
			variants.push(309);
			break;

		case 107: // k
			variants.push(311);
			variants.push(1179);
			variants.push(7729);
			variants.push(7731);
			variants.push(7733);
			variants.push(42915);
			variants.push(65945);
			break;

		case 108: // l
			variants.push(314);
			variants.push(316);
			variants.push(318);
			variants.push(320);
			variants.push(322);
			variants.push(7735);
			variants.push(7737);
			variants.push(7739);
			variants.push(7741);
			break;

		case 109: // m
			variants.push(7743);
			variants.push(7745);
			variants.push(7747);
			break;

		case 110: // n
			variants.push(324);
			variants.push(326);
			variants.push(328);
			variants.push(329);
			variants.push(331);
			variants.push(7749);
			variants.push(7751);
			variants.push(7753);
			variants.push(7755);
			variants.push(42917);
			variants.push(65950);
			break;

		case 111: // o
			
			variants.push(7757);
			variants.push(7759);
			variants.push(7761);
			variants.push(7763);
			variants.push(7885);
			variants.push(7887);
			variants.push(7889);
			variants.push(7891);
			variants.push(7893);
			variants.push(7895);
			variants.push(7897);
			variants.push(7899);
			variants.push(7901);
			variants.push(7903);
			variants.push(7905);
			variants.push(7907);
			variants.push(9004);
			break;

		case 112: // p
			variants.push(1167);
			variants.push(7765);
			variants.push(7767);
			break;

		case 113: // q
			variants.push(491);
			variants.push(493);
			break;

		case 114: // r
			variants.push(7769);
			variants.push(7771);
			variants.push(7773);
			variants.push(7775);
			
			break;

		case 115: // s
			variants.push(349);
			variants.push(351);
			variants.push(353);
			variants.push(575);
			variants.push(7777);
			variants.push(7779);
			variants.push(7781);
			variants.push(7783);
			variants.push(7785);
			variants.push(42921);
			break;

		case 116: // t
			variants.push(355);
			variants.push(357);
			variants.push(359);
			variants.push(566);
			variants.push(7787);
			variants.push(7789);
			variants.push(7791);
			variants.push(7793);
			variants.push(7831);
			variants.push(65963);
			break;

		case 117: // u
			variants.push(359);
			variants.push(361);
			variants.push(363);
			variants.push(365);
			variants.push(367);
			variants.push(369);
			variants.push(371);
			variants.push(7795);
			variants.push(7797);
			variants.push(7799);
			variants.push(7801);
			variants.push(7909);
			variants.push(7911);
			variants.push(7913);
			variants.push(7915);
			variants.push(7917);
			variants.push(7919);
			variants.push(7921);
			variants.push(7803);
			break;

		case 118: // v
			variants.push(7805);
			variants.push(7807);
			variants.push(11380);
			break;

		case 119: // w
			variants.push(7809);
			variants.push(7811);
			variants.push(7813);
			variants.push(7815);
			variants.push(7817);
			variants.push(7832);
			variants.push(9077);
			variants.push(9081);
			break;

		case 120: // x
			variants.push(7819);
			variants.push(7821);
			variants.push(967);
			variants.push(1008);
			break;

		case 121: // y
			variants.push(591);
			variants.push(7823);
			variants.push(7833);
			variants.push(7923);
			variants.push(7925);
			variants.push(7927);
			variants.push(7929);
			variants.push(8509);
			break;

		case 122: // z
			variants.push(549);
			variants.push(576);
			variants.push(7825);
			variants.push(7827);
			variants.push(7829);
			variants.push(65974);
			break;

		default:
			console.log('Передана не буква в латинской раскладке');
			break;
	}

	if(!variants.length) {
		variants.push(code);
	}

	for (let i = 0; i < variants.length; i++) {
		variants[i] = String.fromCharCode(variants[i]);
	}

	return variants;
}