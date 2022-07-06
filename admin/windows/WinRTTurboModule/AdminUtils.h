#pragma once

#include "pch.h"

#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <tchar.h>
#include <windows.h>

#include "NativeModules.h"

namespace WinRTTurboModule {
    REACT_MODULE(AdminUtils);
    struct AdminUtils
    {
        REACT_METHOD(CheckDev);
        void CheckDev() noexcept {
            system("CheckDev.bat");
        }
    };
}