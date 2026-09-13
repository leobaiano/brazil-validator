using System.Collections.Generic;
using BrValidator.Ie;
using Xunit;

namespace BrValidator.Tests
{
    public class IeTests
    {
        // Every value below is either the exact worked example published by
        // the state's own SEFAZ "Roteiro de Crítica da Inscrição Estadual"
        // (mirrored at sintegra.gov.br/Cad_Estados/cad_XX.html), or, where
        // the source describes the algorithm without a numeric example
        // (RJ's weights, MG's second vector, MS), a value independently
        // hand-computed against that same official algorithm. DF is the
        // one exception: sintegra.gov.br's own DF page is empty, so its
        // vector instead comes from two independent secondary sources that
        // agree with each other and whose arithmetic was re-checked by
        // hand (see Df.cs). This mirrors the vectors used by the
        // TypeScript, Go, Python, Java, and Ruby test suites, so all six
        // ports are checked against the same regression data.
        public static IEnumerable<object[]> OfficialVectors => new List<object[]>
        {
            new object[] { "SP", "110042490114" },
            new object[] { "RJ", "99999993" },
            new object[] { "RJ", "12345674" },
            new object[] { "MG", "0623079040081" },
            new object[] { "MG", "3131234560089" },
            new object[] { "AC", "0100482300112" },
            new object[] { "AL", "240000048" },
            new object[] { "AM", "999999990" },
            new object[] { "AP", "030123459" },
            new object[] { "BA", "12345663" },
            new object[] { "BA", "61234557" },
            new object[] { "BA", "100000306" },
            new object[] { "CE", "060000015" },
            new object[] { "ES", "999999990" },
            new object[] { "GO", "109876547" },
            new object[] { "MA", "120000385" },
            new object[] { "MS", "281234566" },
            new object[] { "MT", "00130000019" },
            new object[] { "PA", "159999995" },
            new object[] { "PA", "750000023" },
            new object[] { "PB", "060000015" },
            new object[] { "PE", "032141840" },
            new object[] { "PI", "012345679" },
            new object[] { "PR", "1234567850" },
            new object[] { "RN", "200400401" },
            new object[] { "RN", "2000400400" },
            new object[] { "RO", "00000000625213" },
            new object[] { "RR", "240061536" },
            new object[] { "RR", "240066281" },
            new object[] { "RR", "240017556" },
            new object[] { "RR", "240034290" },
            new object[] { "RR", "240013603" },
            new object[] { "RR", "240082668" },
            new object[] { "RR", "240073562" },
            new object[] { "RR", "240054674" },
            new object[] { "RR", "240041455" },
            new object[] { "RR", "240013407" },
            new object[] { "RS", "2243658792" },
            new object[] { "SC", "251040852" },
            new object[] { "SE", "271234563" },
            new object[] { "TO", "29010227836" },
            new object[] { "DF", "0730000100109" },
        };

        private static string FlipLastDigit(string value)
        {
            int last = value[value.Length - 1] - '0';
            return value.Substring(0, value.Length - 1) + ((last + 1) % 10);
        }

        [Theory]
        [MemberData(nameof(OfficialVectors))]
        public void OfficialVectorsAreValid(string uf, string value)
        {
            Assert.True(BrValidator.Ie.Ie.IsValid(value, uf), $"{uf} {value}");
        }

        [Theory]
        [MemberData(nameof(OfficialVectors))]
        public void TamperedOfficialVectorsAreInvalid(string uf, string value)
        {
            string tampered = FlipLastDigit(value);
            Assert.False(BrValidator.Ie.Ie.IsValid(tampered, uf), $"{uf} {tampered}");
        }

        [Theory]
        [InlineData("SP", "110.042.490.114")]
        [InlineData("RJ", "99.999.99-3")]
        [InlineData("MG", "062.307.904/0081")]
        [InlineData("AC", "01.004.823/001-12")]
        [InlineData("AM", "99.999.999-0")]
        [InlineData("BA", "123456-63")]
        [InlineData("BA", "612345-57")]
        [InlineData("BA", "1000003-06")]
        [InlineData("CE", "06000001-5")]
        [InlineData("GO", "10.987.654-7")]
        [InlineData("MT", "0013000001-9")]
        [InlineData("PA", "15999999-5")]
        [InlineData("PA", "75000002-3")]
        [InlineData("PE", "0321418-40")]
        [InlineData("PR", "123.45678-50")]
        [InlineData("RN", "20.040.040-1")]
        [InlineData("RN", "20.0.040.040-0")]
        [InlineData("RO", "0000000062521-3")]
        [InlineData("RR", "24006153-6")]
        [InlineData("RS", "224/3658792")]
        [InlineData("SC", "251.040.852")]
        [InlineData("SE", "27123456-3")]
        [InlineData("DF", "07.300.001.001-09")]
        [InlineData("SP", "P-01100424.3/002")]
        public void FormattedOfficialExamples(string uf, string value)
        {
            Assert.True(BrValidator.Ie.Ie.IsValid(value, uf), $"{uf} {value}");
        }

        [Theory]
        [InlineData("AC", "0200482300112")]
        [InlineData("AL", "241000048")]
        [InlineData("AP", "040123459")]
        [InlineData("GO", "159876547")]
        [InlineData("MS", "291234566")]
        [InlineData("PA", "169999995")]
        [InlineData("RN", "210400401")]
        [InlineData("RR", "230061536")]
        [InlineData("TO", "29040227836")]
        [InlineData("DF", "0830000100109")]
        public void PrefixAndTypeConstraints(string uf, string value)
        {
            Assert.False(BrValidator.Ie.Ie.IsValid(value, uf), $"{uf} {value}");
        }

        [Fact]
        public void ProdutorRural()
        {
            Assert.True(BrValidator.Ie.Ie.IsValid("P-01100424.3/002", "SP"));
            Assert.True(BrValidator.Ie.Ie.IsValid("p-01100424.3/002", "SP"));
            Assert.False(BrValidator.Ie.Ie.IsValid("P-01100424.4/002", "SP"));
            Assert.False(BrValidator.Ie.Ie.IsValid("P-11100424.3/002", "SP"));
            Assert.Equal("P011004243002", BrValidator.Ie.Ie.Normalize("p-01100424.3/002", "SP"));
            Assert.Equal("P-01100424.3/002", BrValidator.Ie.Ie.Format("P011004243002", "SP"));
        }

        [Fact]
        public void UnsupportedUf()
        {
            Assert.False(BrValidator.Ie.Ie.IsValid("110042490114", "XX"));
            Assert.Equal("110042490114", BrValidator.Ie.Ie.Normalize("110042490114", "XX"));
            Assert.Equal("110042490114", BrValidator.Ie.Ie.Format("110042490114", "XX"));
        }

        [Theory]
        [InlineData("SP", "110.042.490.114", "110042490114")]
        [InlineData("RJ", "99.999.99-3", "99999993")]
        [InlineData("MG", "062.307.904/0081", "0623079040081")]
        [InlineData("BA", "123456-63", "12345663")]
        [InlineData("RS", "224/3658792", "2243658792")]
        [InlineData("DF", "07.300.001.001-09", "0730000100109")]
        public void NormalizeAndFormatRoundTrip(string uf, string formatted, string normalized)
        {
            Assert.Equal(normalized, BrValidator.Ie.Ie.Normalize(formatted, uf));
            Assert.Equal(formatted, BrValidator.Ie.Ie.Format(normalized, uf));
        }

        [Fact]
        public void FormatWithInvalidLengthReturnsUnchanged()
        {
            Assert.Equal("123", BrValidator.Ie.Ie.Format("123", "SP"));
        }
    }
}
