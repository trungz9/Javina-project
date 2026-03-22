#include <windows.h>
#include <stdio.h>
#include <math.h>
#include <time.h>

typedef struct {
    int start;
    int end;
    int count;
} ThreadData;

// Hàm kiểm tra số nguyên tố
int is_prime(int n) {
    if (n < 2) return 0;
    if (n == 2 || n == 3) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    }
    return 1;
}

// Hàm thực thi cho mỗi luồng
DWORD WINAPI count_primes(LPVOID lpParam) {
    ThreadData* data = (ThreadData*)lpParam;
    data->count = 0;
    for (int i = data->start; i <= data->end; i++) {
        if (is_prime(i)) {
            data->count++;
        }
    }
    return 0;
}

void run_with_threads(int num_threads, int limit) {
    HANDLE* handles = (HANDLE*)malloc(num_threads * sizeof(HANDLE));
    ThreadData* data = (ThreadData*)malloc(num_threads * sizeof(ThreadData));

    int range = limit / num_threads;

    LARGE_INTEGER frequency, start_time, end_time;
    QueryPerformanceFrequency(&frequency);
    QueryPerformanceCounter(&start_time);

    for (int i = 0; i < num_threads; i++) {
        data[i].start = i * range + 1;
        data[i].end = (i == num_threads - 1) ? limit : (i + 1) * range;

        handles[i] = CreateThread(NULL, 0, count_primes, &data[i], 0, NULL);
    }

    int total_primes = 0;
    for (int i = 0; i < num_threads; i++) {
        WaitForSingleObject(handles[i], INFINITE);
        total_primes += data[i].count;
        CloseHandle(handles[i]);
    }

    QueryPerformanceCounter(&end_time);
    double duration = (double)(end_time.QuadPart - start_time.QuadPart) / frequency.QuadPart;

    printf("Threads: %d | Primes: %d | Time: %.4f seconds\n", num_threads, total_primes, duration);

    free(handles);
    free(data);
}

int main() {
    int limit = 10000000;
    int thread_counts[] = { 1, 2, 4, 8 };

    printf("Counting primes from 1 to %d...\n\n", limit);
    for (int i = 0; i < 4; i++) {
        run_with_threads(thread_counts[i], limit);
    }

    return 0;
}