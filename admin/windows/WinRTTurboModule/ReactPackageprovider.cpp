#include "pch.h"
#include "ReactPackageProvider.h"
#include "ReactPackageProvider.g.cpp"

#include <ModuleRegistration.h>

#include "FancyMath.h"

namespace winrt::WinRTTurboModule::implementation
{
    void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept
    {
        AddAttributedModules(packageBuilder);
    }
}