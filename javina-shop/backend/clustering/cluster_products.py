import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
import pickle

# Kết nối DB
conn = mysql.connector.connect(
    host='localhost', user='root',
    password='your_password', database='javina-shop'
)
cursor = conn.cursor(dictionary=True)

# Lấy sản phẩm
cursor.execute("SELECT id, name, description FROM products WHERE is_active=1")
products = cursor.fetchall()

# Chuẩn bị text
docs = []
for p in products:
    text = f"{p['name']} {p['description'] or ''}"
    docs.append(text.lower())

# TF-IDF
vectorizer = TfidfVectorizer(max_features=100)
X = vectorizer.fit_transform(docs)

# K-Means — 6 cluster = 6 danh mục
k = 6
kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
kmeans.fit(X)

# In top words mỗi cluster (copy vào luận án)
print("=== Top terms per cluster ===")
terms = vectorizer.get_feature_names_out()
for i, center in enumerate(kmeans.cluster_centers_):
    top = center.argsort()[-10:][::-1]
    words = [terms[j] for j in top]
    print(f"Cluster {i+1}: {', '.join(words)}")

# Lưu cluster_id vào DB
for i, p in enumerate(products):
    cluster_id = int(kmeans.labels_[i])
    cursor.execute(
        "UPDATE products SET cluster_id=%s WHERE id=%s",
        (cluster_id, p['id'])
    )

conn.commit()
print(f"\n✅ Gán cluster cho {len(products)} sản phẩm!")

# Lưu model để dùng trong API
with open('model.pkl', 'wb') as f:
    pickle.dump({'vectorizer': vectorizer, 'kmeans': kmeans}, f)
print("✅ Lưu model.pkl!")

cursor.close()
conn.close()