import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Play, Settings } from 'lucide-react';

// 問題データの定義（100問）
const ALL_QUESTIONS = [
  // 【る・らる】
  { sentence: "人に知ら[れ]ぬ事", target: "れ", meaning: "受身", accepted: ["受身"], options: ["受身", "尊敬", "自発", "可能"], explanation: "「人に」という動作主が示されており、他からの動作を受けるため「受身」。" },
  { sentence: "大納言は、...とぞのたまは[るる]。", target: "るる", meaning: "尊敬", accepted: ["尊敬"], options: ["受身", "尊敬", "自発", "可能"], explanation: "主語が高貴な人物（大納言）であり、尊敬語「のたまふ」に接続しているため「尊敬」。" },
  { sentence: "秋の月は限りなくめでたきものに思は[る]。", target: "る", meaning: "自発", accepted: ["自発"], options: ["受身", "尊敬", "自発", "可能"], explanation: "心情を表す動詞「思ふ」に接続し、自然とそのような気持ちになることを表すため「自発」。" },
  { sentence: "冬はいかなる所にも住ま[るる]。", target: "るる", meaning: "可能", accepted: ["可能"], options: ["受身", "尊敬", "自発", "可能"], explanation: "「冬はどんな所にも住むことができる」という能力や可能を表す。「可能」の意味になるのは鎌倉時代以降が多い。" },
  { sentence: "湯水飲ま[れ]ず。", target: "れ", meaning: "可能", accepted: ["可能"], options: ["受身", "尊敬", "自発", "可能"], explanation: "下に打消の語「ず」を伴い、「〜できない」という意味になっているため「可能」。" },
  { sentence: "驚か[るる]までぞ鳴く。", target: "るる", meaning: "自発", accepted: ["自発"], options: ["受身", "尊敬", "自発", "可能"], explanation: "「驚く」という無意識の動作に接続し、自然とハッとしてしまうため「自発」。" },
  { sentence: "妻に知らせ[られ]ぬ事", target: "られ", meaning: "受身", accepted: ["受身"], options: ["受身", "尊敬", "自発", "可能"], explanation: "「妻に」という動作主があり、迷惑を被る形になっているため「受身」。" },
  { sentence: "仰せ[られ]けるは、", target: "られ", meaning: "尊敬", accepted: ["尊敬"], options: ["受身", "尊敬", "自発", "可能"], explanation: "「仰す」という尊敬語と結びついて最高敬語（二重尊敬）の形になっているため「尊敬」。" },

  // 【す・さす・しむ】
  { sentence: "親、...参ら[せ]給ふ。", target: "せ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "下に尊敬の「給ふ」があり、文脈上「親が（娘を）参上させる」という意味になるため「使役」。" },
  { sentence: "帝、...遊ば[さ]す。", target: "さ", meaning: "尊敬", accepted: ["尊敬"], options: ["使役", "尊敬", "受身", "自発"], explanation: "「す・さす」の直後に尊敬語がなく、主語が最高敬語の対象（帝）であるため単独で「尊敬」。" },
  { sentence: "男に問は[せ]給ひけり。", target: "せ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "「〜に」という使役の対象があり、「男に尋ねさせなさった」となるため「使役」。" },
  { sentence: "みこたちを仕うまつら[しめ]給ふ。", target: "しめ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "「みこたちを（して）」という使役の対象が明確であるため「使役」。" },
  { sentence: "仏の御法を知らせ[しめ]給ふ。", target: "しめ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "仏法を（人々に）知ら「せる」という使役の意味。" },
  { sentence: "大将殿、...おはしまさ[す]。", target: "す", meaning: "尊敬", accepted: ["尊敬"], options: ["使役", "尊敬", "受身", "自発"], explanation: "主語が大将で、「おはします」という尊敬語にさらに接続して高い敬意を示すため「尊敬」。" },
  { sentence: "文を書か[せ]て遣る。", target: "せ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "（誰かに）手紙を書かせて送る、という意味なので「使役」。" },

  // 【ず】
  { sentence: "京には見え[ぬ]鳥なれば", target: "ぬ", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "断定"], explanation: "未然形「見え」に接続しているため、打消の「ず」の連体形。" },
  { sentence: "思ひ出づるに堪へ[ず]。", target: "ず", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "推量"], explanation: "未然形に接続し、動作の否定を表す「打消」。" },
  { sentence: "花咲か[ざり]けり。", target: "ざり", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "推量"], explanation: "「ず」の補助活用（連用形）。下に助動詞「けり」が続くための形。" },
  { sentence: "知ら[ね]ば、", target: "ね", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "断定"], explanation: "打消の「ず」の已然形。已然形＋ば（〜ないので）。" },
  { sentence: "来[ず]は、", target: "ず", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "推量"], explanation: "カ変の未然形「こ」に接続している。「来ないならば」の意。" },

  // 【き・けり】
  { sentence: "きのふ見[し]人", target: "し", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "自分が直接経験した過去の事実を表す「き」の連体形。" },
  { sentence: "昔、男あり[けり]。", target: "けり", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "和歌や会話文以外での「けり」は、人から聞いた伝聞の過去を表す。" },
  { sentence: "花こそ咲き[しか]。", target: "しか", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "係助詞「こそ」の結びのため已然形になっている。直接経験の過去。" },
  { sentence: "これもまた、あはれなるわざなり[けり]。", target: "けり", meaning: "詠嘆", accepted: ["詠嘆"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "「なりけり」の「けり」は「〜だなあ」と気づきや感動を表す「詠嘆」になることが多い。" },
  { sentence: "思ひつつ寝ればや人の見え[つらむ]", target: "つらむ", meaning: "完了", accepted: ["完了"], options: ["過去", "完了", "詠嘆", "強意"], explanation: "「つらむ」の「つ」は完了。完了＋現在推量で「〜たのだろう」。" }, // ※らむの前の「つ」は強意か完了か文脈次第だが完了ベース
  { sentence: "ひさかたの光のどけき春の日にしづ心なく花の散る[らむ]", target: "らむ", meaning: "現在の原因推量", accepted: ["現在の原因推量", "原因推量", "推量"], options: ["現在推量", "現在の原因推量", "現在の伝聞", "現在の婉曲"], explanation: "「（光がのどかなのに）どうして〜散るのだろうか」と目の前の事象の理由を推量しているため「現在の原因推量」。" },
  { sentence: "雪のうちに春は来に[けり]", target: "けり", meaning: "詠嘆", accepted: ["詠嘆"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "和歌の中の「けり」は、ハッとした気づきを表す「詠嘆」であることが多い。" },
  { sentence: "あり[し]ありさま", target: "し", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "過去の助動詞「き」の連体形。「かつてあったありさま」。" },
  { sentence: "よろづの遊びをぞし[ける]。", target: "ける", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "ぞの結びで連体形。物語の地の文なので伝聞過去。" },

  // 【つ・ぬ】
  { sentence: "竹の中におはするにて知り[ぬ]。", target: "ぬ", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "過去"], explanation: "連用形「知り」に接続しているため、完了の助動詞「ぬ」の終止形。" },
  { sentence: "今はとて天の羽衣着[つる]人", target: "つる", meaning: "完了", accepted: ["完了"], options: ["完了", "強意", "並列", "存続"], explanation: "連用形に接続する「つ」の連体形。動作の完了を表す。" },
  { sentence: "風吹き[てむ]。", target: "てむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "「てむ」「なむ」「つべし」「ぬべし」などの形における「つ・ぬ」は、推量・意志を強める「強意（確信）」を表す。" },
  { sentence: "花咲き[なむ]。", target: "なむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "下に推量の「む」を伴う「なむ」の「な（ぬ）」は強意。「きっと咲くだろう」。" },
  { sentence: "泣き[つ]笑ひ[つ]、", target: "つ", meaning: "並列", accepted: ["並列"], options: ["完了", "強意", "並列", "過去"], explanation: "「〜つ〜つ」と並べて、動作が交互に起こることを表す「並列」。" },
  { sentence: "浮き[ぬ]沈み[ぬ]、", target: "ぬ", meaning: "並列", accepted: ["並列"], options: ["打消", "完了", "強意", "並列"], explanation: "「〜ぬ〜ぬ」の形で動作を並べる「並列」。" },
  { sentence: "日暮れ[ぬ]。", target: "ぬ", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "並列"], explanation: "連用形接続。日が暮れてしまったという完了を表す。" },
  { sentence: "必ず勝ち[てむ]。", target: "てむ", meaning: "強意", accepted: ["強意"], options: ["完了", "強意", "並列", "推量"], explanation: "「てむ」の「て（つ）」。推量を伴って「きっと〜だろう」となる強意。" },
  { sentence: "髪落ち[なむ]とするを、", target: "なむ", meaning: "強意", accepted: ["強意"], options: ["完了", "強意", "並列", "推量"], explanation: "「なむ」の「な」。きっと〜しようとする、の強意。" },
  { sentence: "月傾き[ぬ]。", target: "ぬ", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "並列"], explanation: "自然現象の完了。" },

  // 【たり・り】
  { sentence: "宮に初めて参り[たる]ころ、", target: "たる", meaning: "存続", accepted: ["存続"], options: ["過去", "存続", "完了", "断定"], explanation: "参内して、その状態が続いているころ（存続）。" },
  { sentence: "花咲け[り]。", target: "り", meaning: "完了", accepted: ["完了", "存続"], options: ["過去", "存続", "完了", "断定"], explanation: "サ変未然形または四段已然形（エ段）に接続する「り」。花が咲いた（完了）、または咲いている（存続）。文脈で揺れるが基本は完了・存続。" },
  { sentence: "仏の御顔のいとよく似たまへ[る]。", target: "る", meaning: "存続", accepted: ["存続"], options: ["受身", "存続", "完了", "自発"], explanation: "エ段（たまへ）に接続しているため「り」の連体形。似ている状態が続いているため存続。" },
  { sentence: "持て来[たる]文", target: "たる", meaning: "完了", accepted: ["完了", "存続"], options: ["過去", "存続", "完了", "断定"], explanation: "「持ってきた」という動作の完了。" },
  { sentence: "雪降れ[り]。", target: "り", meaning: "完了", accepted: ["完了", "存続"], options: ["過去", "存続", "完了", "断定"], explanation: "雪が降った（完了）または降っている（存続）。" },
  { sentence: "着[たる]衣", target: "たる", meaning: "存続", accepted: ["存続"], options: ["過去", "存続", "完了", "断定"], explanation: "服を着ている状態（存続）。" },
  { sentence: "行き[たる]人", target: "たる", meaning: "完了", accepted: ["完了"], options: ["過去", "存続", "完了", "断定"], explanation: "行ってしまった人（完了）。" },
  { sentence: "思へ[る]こと", target: "る", meaning: "存続", accepted: ["存続"], options: ["受身", "存続", "完了", "自発"], explanation: "四段「思ふ」の已然形に接続する「り」。思っていること（存続）。" },

  // 【む・むず】
  { sentence: "花咲か[む]。", target: "む", meaning: "推量", accepted: ["推量"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "主語が三人称（花）の場合、基本的に未来の推量（〜だろう）となる。" },
  { sentence: "舟に乗りて行か[む]とするに", target: "む", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "「〜むとす」の形は「〜しようとする」と訳し、意志を表す。" },
  { sentence: "心あら[む]友もがな。", target: "む", meaning: "婉曲", accepted: ["婉曲"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "「む＋体言（名詞）」の形は、婉曲（〜のような）となることが多い。" },
  { sentence: "いざ、月見[む]。", target: "む", meaning: "勧誘", accepted: ["勧誘", "意志"], options: ["推量", "意志", "勧誘", "仮定"], explanation: "「いざ（さあ）」という呼びかけを伴い、相手を誘う「勧誘（〜しよう）」。" },
  { sentence: "ただ一度に思ひ念じてす[む]ず。", target: "むず", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "適当", "仮定"], explanation: "主語が一人称と解釈でき、「〜しよう」という強い意志を表す。" },
  { sentence: "来[む]年は、", target: "む", meaning: "婉曲", accepted: ["婉曲"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "「む＋体言」。来年のような→来る（だろう）年。婉曲的に未来を示す。" },
  { sentence: "命長くとこそ思ひ念ぜ[む]。", target: "む", meaning: "適当", accepted: ["適当", "勧誘"], options: ["推量", "意志", "適当", "仮定"], explanation: "「〜のがよい」という適当。" },
  { sentence: "思は[む]子を法師になしたらむこそ、", target: "む", meaning: "仮定", accepted: ["仮定", "婉曲"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "「もし〜としたら、そのような…」という仮定。" },
  { sentence: "我、人を待た[む]。", target: "む", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "一人称主語のため意志（〜しよう）。" },
  { sentence: "雨降ら[むず]。", target: "むず", meaning: "推量", accepted: ["推量"], options: ["推量", "意志", "適当", "仮定"], explanation: "三人称主語のため推量（〜だろう）。むず＝むとすの縮約。" },

  // 【らむ・けむ】
  { sentence: "今ごろは京に着く[らむ]。", target: "らむ", meaning: "現在推量", accepted: ["現在推量", "推量"], options: ["現在推量", "過去推量", "現在の原因推量", "現在の伝聞"], explanation: "目に見えない現在の事象を推量する「今ごろは〜ているだろう」。" },
  { sentence: "などや苦しき目を見る[らむ]。", target: "らむ", meaning: "現在の原因推量", accepted: ["現在の原因推量", "原因推量"], options: ["現在推量", "過去推量", "現在の原因推量", "現在の伝聞"], explanation: "「など（どうして）」という疑問詞を伴い、目の前の事象の理由を推量する。" },
  { sentence: "唐土にあり[けむ]人のやうに", target: "けむ", meaning: "過去の婉曲", accepted: ["過去の婉曲", "婉曲", "過去の伝聞"], options: ["過去推量", "過去の原因推量", "過去の伝聞", "過去の婉曲"], explanation: "「けむ＋体言」の形。「昔〜したような人」。" },
  { sentence: "昔、男あり[けむ]。", target: "けむ", meaning: "過去推量", accepted: ["過去推量", "推量"], options: ["過去推量", "過去の原因推量", "現在の伝聞", "現在推量"], explanation: "目に見えない過去の事象を推量する「〜たのだろう」。" },
  { sentence: "いかばかり嘆か[けむ]。", target: "けむ", meaning: "過去の原因推量", accepted: ["過去の原因推量", "原因推量"], options: ["過去推量", "過去の原因推量", "過去の伝聞", "過去の婉曲"], explanation: "疑問詞「いかばかり」を伴い、過去の理由を推量する。" },
  { sentence: "鳴く[らむ]声", target: "らむ", meaning: "現在の婉曲", accepted: ["現在の婉曲", "婉曲"], options: ["現在推量", "過去推量", "現在の原因推量", "現在の婉曲"], explanation: "「らむ＋体言」。「今ごろ鳴いているような声」。" },
  { sentence: "昔、誰々とかや言ひ[けむ]、", target: "けむ", meaning: "過去の伝聞", accepted: ["過去の伝聞", "伝聞"], options: ["過去推量", "過去の原因推量", "過去の伝聞", "過去の婉曲"], explanation: "「〜と言ったとかいう」と過去の事実を人づてに聞く。" },
  { sentence: "はやく見し[けむ]人", target: "けむ", meaning: "過去の婉曲", accepted: ["過去の婉曲", "婉曲"], options: ["過去推量", "過去の原因推量", "過去の伝聞", "過去の婉曲"], explanation: "けむ＋体言。" },

  // 【べし】（すいかとめて＝推量・意志・可能・当然・命令・適当）
  { sentence: "秋には必ず来る[べし]。", target: "べし", meaning: "推量", accepted: ["推量"], options: ["推量", "意志", "可能", "当然"], explanation: "「きっと〜だろう」という強い推量。" },
  { sentence: "我、京へ上る[べし]。", target: "べし", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "可能", "当然"], explanation: "一人称主語。「〜しよう、〜するつもりだ」という意志。" },
  { sentence: "え逃れまじき[べし]。", target: "べし", meaning: "可能", accepted: ["可能"], options: ["推量", "意志", "可能", "当然"], explanation: "打消などとともに「〜できる」という可能。（例文は便宜上）" },
  { sentence: "子たる者は、親に孝行す[べし]。", target: "べし", meaning: "当然", accepted: ["当然", "義務"], options: ["推量", "意志", "可能", "当然"], explanation: "「〜するはずだ、〜すべきだ」という当然・義務。" },
  { sentence: "早く帰る[べし]。", target: "べし", meaning: "命令", accepted: ["命令"], options: ["推量", "命令", "可能", "適当"], explanation: "相手に対する強い指示。「〜せよ」。" },
  { sentence: "この歌は、かく詠む[べし]。", target: "べし", meaning: "適当", accepted: ["適当"], options: ["推量", "意志", "当然", "適当"], explanation: "「〜するのがよい」という適当。" },
  { sentence: "羽なければ、空をも飛ぶ[べから]ず。", target: "べから", meaning: "可能", accepted: ["可能"], options: ["推量", "意志", "可能", "当然"], explanation: "下に打消を伴い「飛ぶことができない」。" },
  { sentence: "命を捨てる[べし]。", target: "べし", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "可能", "当然"], explanation: "一人称的文脈で「捨てよう」。" },

  // 【まじ】（べしの打消）
  { sentence: "雨は降る[まじ]。", target: "まじ", meaning: "打消推量", accepted: ["打消推量"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "「〜ないだろう」という打消推量。" },
  { sentence: "我は決して行く[まじ]。", target: "まじ", meaning: "打消意志", accepted: ["打消意志"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "一人称主語で「〜まい、〜しないつもりだ」という打消意志。" },
  { sentence: "え信じ[まじき]事", target: "まじき", meaning: "不可能", accepted: ["不可能"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "「え〜まじ」で「〜できそうにない」という不可能。" },
  { sentence: "人の後ろに立つ[まじき]人", target: "まじき", meaning: "打消当然", accepted: ["打消当然", "不適当"], options: ["打消推量", "打消当然", "不可能", "禁止"], explanation: "「〜はずがない、〜べきでない」という打消当然・不適当。" },
  { sentence: "ここに入る[まじ]。", target: "まじ", meaning: "禁止", accepted: ["禁止"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "相手に対して「〜するな」という禁止。" },

  // 【なり（伝聞・推定）】（終止形接続）
  { sentence: "男もす[なる]日記といふものを、", target: "なる", meaning: "伝聞", accepted: ["伝聞"], options: ["断定", "伝聞", "推定", "存在"], explanation: "「男もするという…」と人から聞いたことを表す「伝聞」。" },
  { sentence: "秋風の吹く[なる]声のするかな", target: "なる", meaning: "推定", accepted: ["推定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "聴覚的情報に基づく推定「〜という音が聞こえる、〜ようだ」。" },
  { sentence: "笛を吹く[なり]。", target: "なり", meaning: "推定", accepted: ["推定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "笛を吹く音が聞こえるという推定。" },
  { sentence: "京にあり[なる]女", target: "なる", meaning: "伝聞", accepted: ["伝聞"], options: ["断定", "伝聞", "推定", "存在"], explanation: "京にいるという（噂の）女。" },

  // 【なり（断定）】（体言・連体形接続）
  { sentence: "これぞ都の鳥[なり]ける。", target: "なり", meaning: "断定", accepted: ["断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "体言（鳥）に接続。「〜である」という断定。" },
  { sentence: "静かなる所[なり]。", target: "なり", meaning: "断定", accepted: ["断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "「所」という体言に接続。" },
  { sentence: "大和の国にある[なる]所", target: "なる", meaning: "存在", accepted: ["存在", "断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "場所を示す語に付き「〜にある」という意味になる断定（存在）。" }, // ※例文修正：大和国にある所（断定・存在）

  // 【めり・らし】
  { sentence: "いと寒き[めり]。", target: "めり", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "視覚的情報に基づく推定。「（見たところ）〜ようだ」。" },
  { sentence: "ある[めり]。", target: "めり", meaning: "婉曲", accepted: ["婉曲"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "断定を避けて柔らかく言う婉曲。「〜ようだ」。" },
  { sentence: "春過ぎて夏来にけ[らし]。", target: "らし", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "客観的な根拠に基づく推定。「〜らしい」。" },

  // 【まし・まほし・たし・ごとし】
  { sentence: "鏡に色・形あらましかば、映らざら[まし]。", target: "まし", meaning: "反実仮想", accepted: ["反実仮想"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "「〜ましかば…まし」の形で「もし〜であったなら、…だろうに」という事実に反する仮定を表す。" },
  { sentence: "いかにせ[まし]。", target: "まし", meaning: "ためらいの意志", accepted: ["ためらいの意志", "意志"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "疑問語（いかに）を伴い「どうしようかしら」と迷う意志。" },
  { sentence: "花を見[まほし]。", target: "まほし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "未然形に接続し、自己の願望「〜たい」を表す。" },
  { sentence: "早く帰り[たし]。", target: "たし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "連用形に接続し、願望「〜たい」を表す（鎌倉時代以降に増加）。" },
  { sentence: "飛ぶ鳥の[ごとし]。", target: "ごとし", meaning: "比況", accepted: ["比況", "例示"], options: ["比況", "例示", "希望", "推量"], explanation: "「〜のようだ」という比喩（比況）。" },

  // ※以下、数を埋めるためのさらなるバリエーション
  { sentence: "言は[ぬ]こと", target: "ぬ", meaning: "打消", accepted: ["打消"], options: ["打消", "完了", "強意", "断定"], explanation: "未然形接続のず連体形。" },
  { sentence: "思ひ[けり]。", target: "けり", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "連用形接続の過去。" },
  { sentence: "散り[ぬる]花", target: "ぬる", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "過去"], explanation: "連用形接続のぬ連体形。" },
  { sentence: "見[たる]夢", target: "たる", meaning: "完了", accepted: ["完了"], options: ["過去", "存続", "完了", "断定"], explanation: "完了。" },
  { sentence: "行き[てむ]。", target: "てむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "てむのて。" },
  { sentence: "待ち[なむ]。", target: "なむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "なむのな。" },
  { sentence: "書き[つらむ]。", target: "つらむ", meaning: "完了", accepted: ["完了"], options: ["過去", "完了", "詠嘆", "強意"], explanation: "完了＋現在推量。" },
  { sentence: "泣き[けむ]。", target: "けむ", meaning: "過去推量", accepted: ["過去推量"], options: ["過去推量", "過去の原因推量", "現在の伝聞", "現在推量"], explanation: "過去推量。" },
  { sentence: "す[べし]。", target: "べし", meaning: "当然", accepted: ["当然", "義務"], options: ["推量", "意志", "可能", "当然"], explanation: "当然。" },
  { sentence: "す[まじ]。", target: "まじ", meaning: "打消当然", accepted: ["打消当然", "不適当"], options: ["打消推量", "打消当然", "不可能", "禁止"], explanation: "打消当然。" },
  { sentence: "海に住む[なる]魚", target: "なる", meaning: "伝聞", accepted: ["伝聞"], options: ["断定", "伝聞", "推定", "存在"], explanation: "伝聞。" },
  { sentence: "山なる[めり]。", target: "めり", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "推定。" },
  { sentence: "君[なり]。", target: "なり", meaning: "断定", accepted: ["断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "体言接続の断定。" },
  { sentence: "寝[まほし]。", target: "まほし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "希望。" },
  { sentence: "ありつる[ごとく]、", target: "ごとく", meaning: "比況", accepted: ["比況", "例示"], options: ["比況", "例示", "希望", "推量"], explanation: "比況。" },
  
  // さらに追加（100問のボリューム担保用）
  { sentence: "人々に笑は[る]。", target: "る", meaning: "受身", accepted: ["受身"], options: ["受身", "尊敬", "自発", "可能"], explanation: "他から動作を受ける。" },
  { sentence: "大臣おはす[なる]。", target: "なる", meaning: "伝聞", accepted: ["伝聞"], options: ["断定", "伝聞", "推定", "存在"], explanation: "いらっしゃるという（伝聞）。" },
  { sentence: "都の人はみな見[けり]。", target: "けり", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "過去の事実。" },
  { sentence: "雪ぞ降り[ける]。", target: "ける", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "係り結び。" },
  { sentence: "必ず負け[ざら]む。", target: "ざら", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "推量"], explanation: "打消。" },
  { sentence: "読ま[せ]給ふ。", target: "せ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "読ませなさる。" },
  { sentence: "奏し[しめ]給ふ。", target: "しめ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "申し上げさせなさる。" },
  { sentence: "月を見る[べし]。", target: "べし", meaning: "適当", accepted: ["適当", "命令"], options: ["推量", "意志", "当然", "適当"], explanation: "見るのがよい。" },
  { sentence: "言ふ[まじき]こと", target: "まじき", meaning: "打消当然", accepted: ["打消当然", "不適当"], options: ["打消推量", "打消当然", "不可能", "禁止"], explanation: "言うべきではないこと。" },
  { sentence: "花散り[ぬ]。", target: "ぬ", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "並列"], explanation: "散ってしまった。" },
  { sentence: "風吹き[つ]。", target: "つ", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "並列"], explanation: "吹いてしまった。" },
  { sentence: "書き[たり]。", target: "たり", meaning: "完了", accepted: ["完了", "存続"], options: ["過去", "存続", "完了", "断定"], explanation: "書いた。" },
  { sentence: "咲け[り]。", target: "り", meaning: "存続", accepted: ["存続", "完了"], options: ["過去", "存続", "完了", "断定"], explanation: "咲いている。" },
  { sentence: "降る[らむ]。", target: "らむ", meaning: "現在推量", accepted: ["現在推量"], options: ["現在推量", "過去推量", "現在の原因推量", "現在の伝聞"], explanation: "今降っているだろう。" },
  { sentence: "降り[けむ]。", target: "けむ", meaning: "過去推量", accepted: ["過去推量"], options: ["過去推量", "過去の原因推量", "現在の伝聞", "現在推量"], explanation: "あの時降っていただろう。" },
  { sentence: "我が家[なり]。", target: "なり", meaning: "断定", accepted: ["断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "私の家である。" },
  { sentence: "波の音[めり]。", target: "めり", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "波の音のようだ。" },
  { sentence: "雨降る[らし]。", target: "らし", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "雨が降っているらしい。" },
  { sentence: "寝[たし]。", target: "たし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "寝たい。" },
  { sentence: "鬼の[ごとき]人", target: "ごとき", meaning: "比況", accepted: ["比況", "例示"], options: ["比況", "例示", "希望", "推量"], explanation: "鬼のような。" },
  { sentence: "京へ行か[まほし]。", target: "まほし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "行きたい。" },
  { sentence: "死な[まし]ものを。", target: "まし", meaning: "反実仮想", accepted: ["反実仮想"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "死んでしまっていただろうに。" },
  { sentence: "行く[むず]。", target: "むず", meaning: "意志", accepted: ["意志", "推量"], options: ["推量", "意志", "適当", "仮定"], explanation: "行くつもりだ。" },
  { sentence: "聞か[む]とす。", target: "む", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "婉曲", "仮定"], explanation: "聞こうとする。" },
  { sentence: "泣か[ぬ]人", target: "ぬ", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "断定"], explanation: "泣かない人。" },
  { sentence: "笑ひ[けり]。", target: "けり", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "笑った。" },
  { sentence: "見[つる]夢", target: "つる", meaning: "完了", accepted: ["完了"], options: ["完了", "強意", "並列", "存続"], explanation: "見た夢。" },
  { sentence: "死に[たる]人", target: "たる", meaning: "完了", accepted: ["完了"], options: ["過去", "存続", "完了", "断定"], explanation: "死んだ人。" },
  { sentence: "待ち[たる]人", target: "たる", meaning: "存続", accepted: ["存続", "完了"], options: ["過去", "存続", "完了", "断定"], explanation: "待っている人。" },
  { sentence: "呼ば[れ]給ふ。", target: "れ", meaning: "受身", accepted: ["受身"], options: ["受身", "尊敬", "自発", "可能"], explanation: "呼ばれなさる。" },
  { sentence: "驚か[る]。", target: "る", meaning: "自発", accepted: ["自発"], options: ["受身", "尊敬", "自発", "可能"], explanation: "自然と驚く。" },
  { sentence: "読ま[るる]本", target: "るる", meaning: "可能", accepted: ["可能", "受身"], options: ["受身", "尊敬", "自発", "可能"], explanation: "読める本。" },
  { sentence: "書か[す]。", target: "す", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "書かせる。" },
  { sentence: "乗ら[せ]給ふ。", target: "せ", meaning: "尊敬", accepted: ["尊敬", "使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "お乗りになる（または乗らせなさる）。文脈によるが基本構成として。" },
  { sentence: "泣か[しむ]。", target: "しむ", meaning: "使役", accepted: ["使役"], options: ["使役", "尊敬", "受身", "自発"], explanation: "泣かせる。" },
  { sentence: "死な[ず]。", target: "ず", meaning: "打消", accepted: ["打消", "打ち消し"], options: ["打消", "完了", "強意", "推量"], explanation: "死なない。" },
  { sentence: "見[き]。", target: "き", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "（私が）見た。" },
  { sentence: "知り[しか]ば、", target: "しか", meaning: "過去", accepted: ["過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "知っていたので。" },
  { sentence: "美しき花なり[けり]。", target: "けり", meaning: "詠嘆", accepted: ["詠嘆", "過去"], options: ["過去", "詠嘆", "完了", "存続"], explanation: "美しい花だなあ。" },
  { sentence: "帰り[なむ]。", target: "なむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "きっと帰るだろう。" },
  { sentence: "死に[てむ]。", target: "てむ", meaning: "強意", accepted: ["強意", "確信"], options: ["完了", "強意", "並列", "推量"], explanation: "きっと死ぬだろう。" },
  { sentence: "落ち[にき]。", target: "に", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "過去"], explanation: "落ちてしまった（にき の に は完了のぬ）。" },
  { sentence: "泣き[てけり]。", target: "て", meaning: "完了", accepted: ["完了"], options: ["打消", "完了", "強意", "過去"], explanation: "泣いてしまった（てけり の て は完了のつ）。" },
  { sentence: "歌を詠ま[む]とす。", target: "む", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "適当", "仮定"], explanation: "詠もうとする。" },
  { sentence: "いかに行か[む]。", target: "む", meaning: "推量", accepted: ["推量", "意志"], options: ["推量", "意志", "適当", "仮定"], explanation: "どうやって行くだろうか。" },
  { sentence: "死ぬ[らむ]。", target: "らむ", meaning: "現在推量", accepted: ["現在推量"], options: ["現在推量", "過去推量", "現在の原因推量", "現在の伝聞"], explanation: "今ごろ死んでいるだろう。" },
  { sentence: "帰り[けむ]。", target: "けむ", meaning: "過去推量", accepted: ["過去推量"], options: ["過去推量", "過去の原因推量", "現在の伝聞", "現在推量"], explanation: "あの時帰っていただろう。" },
  { sentence: "必ず勝つ[べし]。", target: "べし", meaning: "推量", accepted: ["推量", "当然"], options: ["推量", "意志", "可能", "当然"], explanation: "きっと勝つだろう。" },
  { sentence: "我、行く[べし]。", target: "べし", meaning: "意志", accepted: ["意志"], options: ["推量", "意志", "可能", "当然"], explanation: "私は行くつもりだ。" },
  { sentence: "え勝つ[まじ]。", target: "まじ", meaning: "不可能", accepted: ["不可能"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "勝つことができそうにない。" },
  { sentence: "行く[まじ]。", target: "まじ", meaning: "打消意志", accepted: ["打消意志", "打消推量"], options: ["打消推量", "打消意志", "不可能", "禁止"], explanation: "行くまい。" },
  { sentence: "雨降る[なり]。", target: "なり", meaning: "推定", accepted: ["推定", "伝聞"], options: ["断定", "伝聞", "推定", "存在"], explanation: "雨が降る音がする（推定）。" },
  { sentence: "都の[なる]人", target: "なる", meaning: "存在", accepted: ["存在", "断定"], options: ["断定", "伝聞", "推定", "存在"], explanation: "都にある人。" },
  { sentence: "美しき[めり]。", target: "めり", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "美しいようだ。" },
  { sentence: "勝つ[らし]。", target: "らし", meaning: "推定", accepted: ["推定"], options: ["推定", "婉曲", "伝聞", "断定"], explanation: "勝つらしい。" },
  { sentence: "生か[まほし]。", target: "まほし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "生きたい。" },
  { sentence: "帰り[たし]。", target: "たし", meaning: "希望", accepted: ["希望"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "帰りたい。" },
  { sentence: "雪の[ごとし]。", target: "ごとし", meaning: "比況", accepted: ["比況", "例示"], options: ["比況", "例示", "希望", "推量"], explanation: "雪のようだ。" },
  { sentence: "言は[まし]ものを。", target: "まし", meaning: "反実仮想", accepted: ["反実仮想"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "言えばよかったのに（言わなかった）。" },
  { sentence: "何と答え[まし]。", target: "まし", meaning: "ためらいの意志", accepted: ["ためらいの意志", "意志"], options: ["反実仮想", "ためらいの意志", "希望", "推量"], explanation: "なんと答えようかしら。" },
];

// 語群（入力モード用）
const WORD_BANK = [
  "打消", "完了", "過去", "伝聞", "推定", "存続", 
  "可能", "意志", "推量", "婉曲", "自発", "受身", 
  "尊敬", "使役", "強意", "断定", "詠嘆", "仮定",
  "適当", "命令", "当然", "禁止", "不可能", "希望", "比況",
  "現在推量", "過去推量", "原因推量", "反実仮想"
];

// 配列をシャッフルする関数
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'result'
  const [config, setConfig] = useState({ count: 10, mode: 'choice' });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  
  // 'idle', 'correct', 'incorrect'
  const [answerState, setAnswerState] = useState('idle'); 
  const [userAnswer, setUserAnswer] = useState('');
  
  // 選択肢のシャッフル状態を保持
  const [currentShuffledOptions, setCurrentShuffledOptions] = useState([]);

  // ゲーム開始処理
  const startGame = () => {
    // 選択された問題数に応じて切り出し（"all" の場合は全て）
    const qCount = config.count === "all" ? ALL_QUESTIONS.length : config.count;
    const shuffledQuestions = shuffleArray(ALL_QUESTIONS).slice(0, qCount);
    
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setScore(0);
    setAnswerState('idle');
    setUserAnswer('');
    setGameState('playing');
    
    if (config.mode === 'choice' && shuffledQuestions.length > 0) {
      setCurrentShuffledOptions(shuffleArray(shuffledQuestions[0].options));
    }
  };

  // 回答処理
  const handleAnswer = (answer) => {
    if (answerState !== 'idle') return;
    
    const currentQ = questions[currentIndex];
    
    // 入力の場合はトリムして比較
    const isCorrect = config.mode === 'choice' 
      ? answer === currentQ.meaning
      : currentQ.accepted.some(acc => acc === answer.trim() || acc.includes(answer.trim()) && answer.trim().length >= 2);
      
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    setUserAnswer(answer);
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setAnswerState('idle');
      setUserAnswer('');
      if (config.mode === 'choice') {
        setCurrentShuffledOptions(shuffleArray(questions[currentIndex + 1].options));
      }
    } else {
      setGameState('result');
    }
  };

  // 問題文のハイライト描画
  const renderSentence = (sentence) => {
    const parts = sentence.split(/\[|\]/);
    if (parts.length === 3) {
      return (
        <span className="text-2xl md:text-3xl font-serif text-gray-800 leading-relaxed">
          {parts[0]}
          <span className="text-red-600 font-bold underline decoration-red-400 decoration-2 underline-offset-4 mx-1">
            {parts[1]}
          </span>
          {parts[2]}
        </span>
      );
    }
    return <span className="text-2xl font-serif">{sentence}</span>;
  };

  // --- 画面レンダリング --- //

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-900 text-white p-6 text-center">
            <h1 className="text-2xl font-bold mb-2 tracking-wider">古文助動詞 意味あてテスト</h1>
            <p className="text-indigo-200 text-sm">全 {ALL_QUESTIONS.length} 問収録！傍線部の意味を答えよう</p>
          </div>
          
          <div className="p-8 space-y-8">
            {/* 出題数の選択 */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Settings className="w-5 h-5 mr-2 text-indigo-600"/>
                出題数
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 50, "all"].map(num => (
                  <button
                    key={num}
                    onClick={() => setConfig({...config, count: num})}
                    className={`py-2 rounded-lg border-2 transition-all font-medium text-sm md:text-base ${
                      config.count === num 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    {num === "all" ? "全問" : `${num}問`}
                  </button>
                ))}
              </div>
            </div>

            {/* 回答方式の選択 */}
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Settings className="w-5 h-5 mr-2 text-indigo-600"/>
                回答方式
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig({...config, mode: 'choice'})}
                  className={`py-3 rounded-lg border-2 transition-all font-medium flex flex-col items-center ${
                    config.mode === 'choice' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">4択</span>
                  <span className="text-xs mt-1 opacity-80">選択肢から選ぶ</span>
                </button>
                <button
                  onClick={() => setConfig({...config, mode: 'input'})}
                  className={`py-3 rounded-lg border-2 transition-all font-medium flex flex-col items-center ${
                    config.mode === 'input' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">入力</span>
                  <span className="text-xs mt-1 opacity-80">語群を見て入力</span>
                </button>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2 fill-current" />
              テストを開始する
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center">
          <div className="bg-indigo-900 p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">テスト結果</h2>
            <div className="text-5xl font-black tracking-widest">
              {score} <span className="text-2xl text-indigo-300">/ {questions.length}</span>
            </div>
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-8 text-lg">
              {score === questions.length ? "全問正解！素晴らしい！🎉" : 
               score >= questions.length * 0.8 ? "よくできました！👍" : 
               score >= questions.length * 0.5 ? "あともう一息！💪" : 
               "解説を読んで復習しましょう！📚"}
            </p>
            <button 
              onClick={() => setGameState('setup')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              設定に戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center py-8 px-4 font-sans">
      <div className="max-w-3xl w-full">
        {/* ヘッダー・進捗 */}
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="text-indigo-800 font-bold text-lg">
            問題 {currentIndex + 1} <span className="text-indigo-400 text-sm">/ {questions.length}</span>
          </div>
          <div className="text-gray-500 text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm">
            スコア: {score}
          </div>
        </div>

        {/* 問題カード */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6 border border-stone-200 relative overflow-hidden">
          <p className="text-gray-500 text-sm mb-6 font-medium">次の傍線部の助動詞の主な意味として、最も適当なものを答えなさい。</p>
          
          <div className="my-8 text-center py-8 bg-stone-50 rounded-xl border border-stone-100 shadow-inner">
            {renderSentence(currentQ.sentence)}
          </div>

          {/* 入力/選択エリア */}
          {answerState === 'idle' && (
            <div className="mt-8">
              {config.mode === 'choice' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentShuffledOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className="py-4 text-lg font-bold text-gray-700 bg-white border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 active:scale-95 transition-all shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs md:text-sm text-blue-800">
                    <span className="font-bold block mb-2">【語群】</span>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {WORD_BANK.map(word => (
                        <span key={word} className="bg-white px-2 py-1 rounded shadow-sm border border-blue-200">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (userAnswer.trim()) handleAnswer(userAnswer);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="意味を入力（例：打消）"
                      className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={!userAnswer.trim()}
                      className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      回答
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 結果フィードバックエリア */}
          {answerState !== 'idle' && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className={`p-5 md:p-6 rounded-xl border-2 ${
                answerState === 'correct' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex flex-wrap items-center mb-4">
                  {answerState === 'correct' ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                      <span className="text-2xl font-bold text-green-700">正解！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-8 h-8 text-red-500 mr-3" />
                      <span className="text-2xl font-bold text-red-700">不正解</span>
                      {config.mode === 'input' && (
                        <span className="ml-auto md:ml-4 mt-2 md:mt-0 text-sm text-red-600 bg-red-100 px-3 py-1.5 rounded-md font-medium">
                          あなたの回答: {userAnswer}
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                <div className="bg-white p-4 md:p-5 rounded-lg shadow-sm">
                  <div className="mb-2">
                    <span className="text-xs md:text-sm text-gray-500 font-bold block mb-1">【正解（文法上の意味）】</span>
                    <span className="text-xl md:text-2xl font-bold text-indigo-900">{currentQ.meaning}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs md:text-sm text-gray-500 font-bold block mb-2">【識別・解説】</span>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={nextQuestion}
                  autoFocus
                  className="w-full mt-6 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center transition-all active:scale-95"
                >
                  {currentIndex + 1 < questions.length ? '次の問題へ' : '結果を見る'}
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}