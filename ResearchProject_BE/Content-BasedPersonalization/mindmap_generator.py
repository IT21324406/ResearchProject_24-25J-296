import spacy
from newspaper import Article
from collections import defaultdict

nlp = spacy.load("en_core_web_sm")

def extract_article_text(url):
    article = Article(url)
    article.download()
    article.parse()
    return article.text

def extract_svo_relationships(text):
    doc = nlp(text)
    svo_map = defaultdict(list)

    topic_candidates = []

    for sent in doc.sents:
        sent_doc = nlp(sent.text)
        for token in sent_doc:
            if token.pos_ == "VERB":
                subject = None
                obj = None

                for child in token.children:
                    if child.dep_ in ["nsubj", "nsubjpass"] and child.pos_ in ["NOUN", "PROPN"]:
                        subject = child.lemma_.lower()

                for child in token.children:
                    if child.dep_ in ["dobj", "pobj", "attr", "dative", "oprd"] and child.pos_ in ["NOUN", "PROPN"]:
                        obj = child.lemma_.lower()

                if subject and obj and subject != obj:
                    svo_map[subject].append({"verb": token.lemma_.lower(), "child": obj})
                    topic_candidates.append(subject)
                    topic_candidates.append(obj)

    # Find most frequent term as central topic
    from collections import Counter
    topic = Counter(topic_candidates).most_common(1)[0][0] if topic_candidates else "topic"

    return {
        "topic": topic,
        "nodes": [
            {"parent": parent, "children": children}
            for parent, children in svo_map.items()
        ]
    }


