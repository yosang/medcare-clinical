using System.Security.Claims;

namespace Extensions;

public static class ClaimsExtension
{
    /// <summary>Looks for and returns the value of PatientId claim from the JWT token</summary>
    /// <param name="user"></param>
    /// <returns>PatientId</returns>
    public static int? GetPatientId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst("PatientId");

        if(claim == null) return null;

        return int.TryParse(claim.Value, out int patientId) ? patientId:null;

    }
}