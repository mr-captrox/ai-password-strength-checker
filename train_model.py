import csv
import numpy as np
import tensorflow as tf
import tensorflowjs as tfjs

def encode_password(password, max_length=20):
    encoded = [ord(c) for c in str(password)[:max_length]]
    if len(encoded) < max_length:
        encoded += [0] * (max_length - len(encoded))
    return encoded

print("Loading dataset...")
X = []
y = []
with open('password_dataset.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader) # skip header
    for row in reader:
        if len(row) == 2:
            X.append(encode_password(row[0]))
            y.append(int(row[1]))

X = np.array(X)
y = np.array(y)

print("Building Neural Network...")
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=256, output_dim=16, input_length=20),
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

print("Training model...")
model.fit(X, y, epochs=20, batch_size=32, validation_split=0.1)

print("Exporting model for the browser...")
tfjs.converters.save_keras_model(model, 'cs/tfjs_model')
print("Model successfully saved to cs/tfjs_model/")
