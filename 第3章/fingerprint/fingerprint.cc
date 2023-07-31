#include <napi.h>
#include <iostream>
#include <sys/types.h>
#include <sys/sysctl.h>
#include <string>

std::string hash(std::string const &s)
{
    const int p = 31;
    const int m = 1e9 + 9;
    long long hash_value = 0;
    long long p_pow = 1;
    for (char c : s)
    {
        hash_value = (hash_value + (c - 'a' + 1) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return std::to_string(hash_value);
}

std::string getFingerprint(void)
{
    char buffer[1024];
    size_t size = sizeof(buffer);
    if (sysctlbyname("machdep.cpu.brand_string", &buffer, &size, NULL, 0) < 0)
    {
        return "";
    }
    std::string res = buffer;
    return hash(res);
}

Napi::String Method(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    std::string fingerprint = getFingerprint();
    return Napi::String::New(env, fingerprint);
}

Napi : Object Init(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "getFingerprint"), Napi::Function::New(env, Method));
    return exports;
}