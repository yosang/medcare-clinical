using System.Security.Claims;

namespace Extensions;

public static class ClaimsExtension
{
    public static int? GetPatientId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst("PatientId");

        if(claim == null) return null;

        return int.TryParse(claim.Value, out int patientId) ? patientId:null;

    }
}